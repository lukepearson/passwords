use std::io::{BufRead, BufReader, Result};
use std::fs::OpenOptions;
use std::fs::File;
use std::path::Path;
use std::io::Write;

fn main() -> Result<()> {
    let file = File::open("pwd.txt")?;
    for line in BufReader::new(file).lines() {
        let _ = add_hash(line?);
    }
    Ok(())
}

fn add_hash(line: String)-> Result<()> {

    let first_two = line.get(0..2).expect("Unable to get first two letters");
    let line_with_ending = "\n".to_string() + &line.to_string();
    let data_path:String = format!("data/{}", first_two);
    let path = Path::new(&data_path);

    let mut file = OpenOptions::new()
        .append(true)
        .create(true)
        .open(path)
        .expect("Unable to create or open file");

    let line_bytes = line_with_ending.as_bytes();
    file.write_all(line_bytes)?;
    Ok(())
}
