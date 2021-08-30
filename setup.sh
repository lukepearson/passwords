#! /bin/bash

curl https://downloads.pwnedpasswords.com/passwords/pwned-passwords-sha1-ordered-by-count-v7.7z -o passwords.7z

mkdir -p data
tar xf passwords.7z
mv pwned-passwords-sha1-ordered-by-count-v7.txt passwords.txt

cargo run

# If max open files limit reached:
# https://superuser.com/questions/261023/how-to-change-default-ulimit-values-in-mac-os-x-10-6