use std::io::{BufRead, BufReader, Result};
use std::fs::OpenOptions;
use std::fs::File;
use std::path::Path;
use std::io::Write;
use std::time::Instant;


fn main() -> Result<()> {
    let start = Instant::now();
    let mut hash_files = open_files();
    let file = File::open("passwords.txt")?;
    let mut count = 0u64;
    println!("Processing file...");
    for line in BufReader::new(file).lines() {
        count += 1;
        if count % 100000 == 0 {
            let elapsed = start.elapsed().as_millis();
            let lps = (count / elapsed as u64) * 1000;
            println!("Processed {} lines in {:?}ms ({} per second)", count, elapsed, lps);

        }
        let line_str = line.unwrap();
        let first_two = line_str.get(0..2).expect("Unable to get first two letters");
        let line_with_ending = "\n".to_string() + &line_str.to_string();
        let line_bytes = line_with_ending.as_bytes();
        let index = usize::from_str_radix(first_two, 16).expect("Unable to convert hex value to usize");
        &mut hash_files[index].write_all(line_bytes)?;
    }
    println!("Finished processing file ({} lines)", count);
    Ok(())
}

fn open_files() -> Vec<File> {
    let mut files: Vec<File> = Vec::new();

    for i in 0..256 {
        let letters = format!("{:02X}", i);
        println!("{}", letters);
        let data_path:String = format!("data/{}", letters);
        let path = Path::new(&data_path);
        let file = OpenOptions::new()
            .append(true)
            .create(true)
            .open(path)
            .expect("Unable to create or open file");

        files.push(file);
    }
    return files;
}
