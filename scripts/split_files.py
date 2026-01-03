import os

CHUNK_SIZE = 95 * 1024 * 1024 # 95MB

def split_file(filepath):
    filesize = os.path.getsize(filepath)
    if filesize <= CHUNK_SIZE:
        print(f"Skipping {filepath} (small enough)")
        return

    print(f"Splitting {filepath} ({filesize / (1024*1024):.2f} MB)...")
    
    with open(filepath, 'rb') as f:
        part_num = 1
        while True:
            chunk = f.read(CHUNK_SIZE)
            if not chunk:
                break
            
            part_name = f"{filepath}.{part_num:03d}"
            with open(part_name, 'wb') as chunk_file:
                chunk_file.write(chunk)
            
            print(f"  Created {part_name}")
            part_num += 1
    
    # We keep the original for now, but gitignore it.

def main():
    data_dir = os.path.join(os.getcwd(), 'data')
    if not os.path.exists(data_dir):
        print("Data dir not found")
        return

    for filename in os.listdir(data_dir):
        if filename.endswith('.zip'):
            split_file(os.path.join(data_dir, filename))

if __name__ == "__main__":
    main()
