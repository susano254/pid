import serial

board_serial = serial.Serial(port='COM5', baudrate=115200, timeout=.1)

def write_bytes(data):
    data += '\n'
    print(data)
    board_serial.write(bytes(data, 'utf-8'))

# def read_bytes():
# 	data = str(board_serial.readline())
# 	data.split(',')
# 	return data
def read_bytes():
    data = board_serial.readline().decode('utf-8')  # decode bytes to string
    numbers = data.strip("b'").strip('\n').replace('\x00', '').split('\t')  # remove unwanted characters, replace null characters, and split at comma
    numbers = [float(n) for n in numbers]  # convert strings to floats
    return numbers 