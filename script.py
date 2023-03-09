import subprocess

# define the path to the Python script to execute
script_path = '/Users/remi/Documents/Git/RemiScripts/helloworld.py'

# call the Python script using the command line
process = subprocess.Popen(['python3', script_path], stdout=subprocess.PIPE)
output, error = process.communicate()

# print the output of the script
print(output.decode())