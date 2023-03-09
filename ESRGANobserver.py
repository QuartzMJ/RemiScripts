import sys
import time 
import logging
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler
import subprocess

class resizer(LoggingEventHandler):
    def on_created(self,event):
        super(LoggingEventHandler,self).on_created(event)
        time.sleep(2)
        script_path = "C:/Users/Remi/Real-ESRGAN/inference_realesrgan.py"
        model_used = "RealESRGAN_x4plus_anime_6B"
        output_path = "C:/Users/Remi/Desktop/output"
        if event.is_directory:
            what = 'directory'
        else:
            what = 'file'
        logging.info("Created %s: %s" % (what, event.src_path))
        extension = event.src_path.split('.')
        if extension[-1] == "jpg" or extension[-1] == "png":
            args = ["python3", script_path, "-n",model_used,"-i",event.src_path,"-t","64","-o",output_path]
            subprocess.run(args)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    if len(sys.argv) > 1:
        path = sys.argv[1]
    else:
        path = 'C:/Users/Remi/Desktop/for super resolution'
    
    event_handler = resizer()

    observer = Observer()

    observer.schedule(event_handler,path,recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

