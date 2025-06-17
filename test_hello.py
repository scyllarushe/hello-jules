import subprocess
import unittest

class TestHelloWorld(unittest.TestCase):

    def test_hello_world_output(self):
        process = subprocess.Popen(['python', 'hello.py'], stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        stdout, stderr = process.communicate()
        self.assertEqual(stdout.decode().strip(), "hello world")
        self.assertEqual(stderr.decode().strip(), "")
        self.assertEqual(process.returncode, 0)

if __name__ == '__main__':
    unittest.main()
