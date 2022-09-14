# images-api
image processing API, used to resize images 
## notice before running 
you need to add .env file containing PORT number and the start script is designed to work with the port in the env file <br/>
 ***or by default the server will run on port 3000***
 <br/> **.env examble where the server will run on PORT 8000**
 ```
 PORT = 8000 
 ```
## functionality 
- take input any type of images extension but internally convert every image to .jpg 
- serve images of any size wanted
- serve endpoint to create gallery from uploaded  images
- the apility to upload new images 

## endPoints
- '/'
    - show main page construct, main page contain form to upload new photos to the server
    - main page also contain gallery using server end point to show all images
- '/image'
    - method = GET
    - serve images from full dir NOTE => image.jpg must be supplied like ``/image/santamonica.jpg``
- 'image/?filename=[IMAGENAME]&width=[number]&height=[number]'
    - method = GET
    - serve image with the required width and height, NOTE => this end point won't work without getting filename[filename without extension], width and height like ``/image/?filename=santamonica&width=200&height=300``
- '/image'
    - method = POST
    - used to upload more images to the server[can be multiply images] NOTE => the input file field must be called ***image***
- '/image/gallery'
    - method = GET
    - return array contain all images names in the full dir throw images field
    - { images : string[] }
    ```js
    let res = await fetch("/image/gallery", {
            method: "get",
        });
        res = await res.json()
        console.log(res) //['santamonica.jpg']
    ```

## scripts
-  run the server from dist [js]
```
npm start
```
- transpile typescript
```
npm run build
```
- run tests
```
npm run test
```
- prettier
```
npm run prettier
```
- eslint 
```
npm run lint
```