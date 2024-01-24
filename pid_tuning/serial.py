import serial

board_serial = serial.Serial(port='COM4', baudrate=115200, timeout=.1)

def write_bytes(data):
    data += '\n'
    print(data)
    board_serial.write(bytes(data, 'utf-8'))

def read_bytes():
    try:
        data = board_serial.readline().decode('utf-8')  # decode bytes to string
        numbers = data.strip("b'").strip('\n').replace('\x00', '').split('\t')  # remove unwanted characters, replace null characters, and split at tab
        numbers = [float(n) for n in numbers]  # convert strings to floats
        print(numbers)
        return numbers
    except ValueError as e:
        print(f"Error converting string to float: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None