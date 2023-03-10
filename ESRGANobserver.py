import sys
import time 
import logging
import argparse
from watchdog.observers import Observer
from watchdog.events import LoggingEventHandler
import subprocess

class Resizer(LoggingEventHandler):

    def __init__(self,python_alias,observe_path,output_folder,tile_size,model_name,script_path,scale):
        super(Resizer, self).__init__()
        self.python_alias = python_alias
        self.observe_path = observe_path
        self.output_folder = output_folder
        self.tile_size = tile_size
        self.model_name = model_name
        self.script_path = script_path
        self.scale = scale

    def on_created(self,event):
        super(LoggingEventHandler,self).on_created(event)
        time.sleep(2)
        if event.is_directory:
            what = 'directory'
        else:
            what = 'file'
        logging.info("Created %s: %s" % (what, event.src_path))
        extension = event.src_path.split('.')
        if extension[-1] == "jpg" or extension[-1] == "png":
            args = [self.python_alias,self.script_path,
                     "-n",self.model_name,"-i",event.src_path,
                     "-o",self.output_folder,"-t",str(self.tile_size),
                     "-s",str(self.scale)]
            print(args)
            subprocess.run(args)


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO,
                        format='%(asctime)s - %(message)s',
                        datefmt='%Y-%m-%d %H:%M:%S')
    
    
    parser = argparse.ArgumentParser()
    parser.add_argument('-i', '--input_folder', type=str, default="C:/Users/Remi/Desktop/for super resolution", help='Folder to observe')
    parser.add_argument('-o', '--output_folder', type=str, default = "C:/Users/Remi/Desktop/output", help= "Folder for output")
    parser.add_argument('-t', '--tile', type=int, default=32, help='Tile size, 0 for no tile during testing')
    parser.add_argument(
        '-n',
        '--model_name',
        type=str,
        default='RealESRGAN_x4plus_anime_6B',
        help=('Model names: RealESRGAN_x4plus | RealESRNet_x4plus | RealESRGAN_x4plus_anime_6B | RealESRGAN_x2plus | '
              'realesr-animevideov3 | realesr-general-x4v3'))
    parser.add_argument('-p','--script_path', type=str, default= "C:/Users/Remi/Real-ESRGAN/inference_realesrgan.py",help='Script path to inference_realesrgan.py')
    parser.add_argument('-a','--python_alias', type=str, default='python', help='Python alias')
    parser.add_argument('-s','--scale', type=int, default = 2, help='Scale')
    args = parser.parse_args()

    python_alias = args.python_alias
    observe_path = args.input_folder
    output_folder = args.output_folder
    tile_size = args.tile
    model_name = args.model_name
    script_path = args.script_path
    scale = args.scale

    event_handler = Resizer(python_alias,observe_path,output_folder,tile_size,model_name,script_path,scale)

    observer = Observer()
    observer.schedule(event_handler,observe_path,recursive=True)
    observer.start()

    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        observer.stop()

    observer.join()

