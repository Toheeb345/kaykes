"use client"
import { Product } from '@/app/_components/PopularProducts'
import { imageKit } from '@/lib/ImageKitInstance'
import { Canvas, FabricImage } from 'fabric'
import { Crop, GalleryVerticalEnd, ImageOff, ImageOffIcon, ImageUpscale, Upload } from 'lucide-react'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    product: Product,
    setDesignUrl: any
}

const DEFAULT_IMAGE = 'https://ik.imagekit.io/jcnxz8smh/logoipsum-422.png?updatedAt=1781565705839'

const AITransformOptions = [
    {
        name: 'BG Remove',
        icon: ImageOff,
        imageKitTr: 'e-bgremove'
    },
    {
        name: 'Upscale',
        icon: ImageUpscale,
        imageKitTr: 'e-upscale'
    },
    {
        name: 'Smart Crop',
        icon: Crop,
        imageKitTr: 'fo-auto'
    },
    {
        name: 'Shadow',
        icon: GalleryVerticalEnd,
        imageKitTr: 'e-shadow'
    }, 
]

const ProductCustomizeStudio = ({product, setDesignUrl} : Props) => {

    const canvasRef = useRef<any>(null);
    const [ canvasInstance, setCanvasInstance ] = useState<any>(null)
    const [ uploadedImage, setUploadedImage ] = useState<string>(DEFAULT_IMAGE)

    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: 150,
                height: 150,
                backgroundColor: 'transparent'
            })
            initCanvas.renderAll();
            setCanvasInstance(initCanvas);

            return () => {
                initCanvas.dispose()
            }
        }
    }, [])

    useEffect(() => {
        if (canvasInstance) {
            AddDefaultImageToCanvas();
            setDesignUrl(uploadedImage);
        }

    }, [canvasInstance, uploadedImage])

    const AddDefaultImageToCanvas = async () => {
        const canvasImageRef = await FabricImage.fromURL(uploadedImage)
        canvasInstance.clear();
        canvasInstance.renderAll();
        canvasImageRef.scaleX=0.3;
        canvasImageRef.scaleY=0.3;
        canvasInstance.add(canvasImageRef);
        canvasInstance.renderAll();
    }


    const onHandleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        // Get file
        const file = event.target.files?.[0];

        // upload to imagekit
        
        if (file) {
            const uploadImageRef = await imageKit.upload({
                // @ts-ignore
            file: file,
            fileName: file?.name,
            isPublished: true,
            useUniqueFileName: false
        });
                
        // @ts-ignore
        const uploadedImageUrl = uploadImageRef?.url;
        console.log(uploadedImageUrl);
        if (uploadedImageUrl) {
            setUploadedImage(uploadedImageUrl);
            canvasInstance.clear();
            canvasInstance.renderAll();
         const canvasImageRef =  await FabricImage.fromURL(uploadedImageUrl)
            
            canvasImageRef.scaleX=0.3;
            canvasImageRef.scaleY=0.3;
            canvasInstance.add(canvasImageRef);
            canvasInstance.renderAll();
        }
        }

    }

const onApplyAITransformation = (transformation: string, add: boolean) => {
    if (!uploadedImage) return;

    try {
        const urlObj = new URL(uploadedImage);
        const trParam = urlObj.searchParams.get('tr') || '';
        
        // 1. Split existing transforms into a clean array (removing any empty strings)
        let currentTransforms = trParam ? trParam.split(',').filter(Boolean) : [];

        if (add) {
            // 2. Add it only if it's not already there (prevents duplicates)
            if (!currentTransforms.includes(transformation)) {
                currentTransforms.push(transformation);
            }
        } else {
            // 3. Cleanly filter it out
            currentTransforms = currentTransforms.filter(t => t !== transformation);
        }

        // 4. Update or delete the 'tr' parameter based on what's left
        if (currentTransforms.length > 0) {
            urlObj.searchParams.set('tr', currentTransforms.join(','));
        } else {
            urlObj.searchParams.delete('tr');
        }

        // 5. Update state with the pristine URL
        setUploadedImage(urlObj.toString());
    } catch (error) {
        console.error("Invalid URL passed to transformation handler:", error);
    }
};

    const isTransformationApplied = (transformation: string) => {
        return uploadedImage?.includes(transformation)?false: true;
    }

  return (
    <div className=' flex flex-col items-center'>
        <div className=' flex items-center flex-col h-80 w-80'>
        <canvas
            id='canvas'
            ref={canvasRef}
            className=' absolute top-20 left-0 z-10 border rounded-2xl border-dashed'
        />
        <Image className=' h-96' src={product?.productimage[0]?.url} alt={product?.title} width={400} height={400}/>


        </div>



        <div className=' flex flex-wrap gap-5 mt-10'>
            <label htmlFor="uploadImage">
            <div className=' border rounded-lg flex flex-col items-center p-5 justify-center text-sm hover:border-primary cursor-pointer hover:bg-blue-50'>
                <Upload />
                <h2>Upload Image</h2>
            </div>
            </label>
            <input type='file' id='uploadImage' className=' hidden' onChange={onHandleImageUpload} />
          
                {AITransformOptions.map((item, index) => (
                    <div key={index} className={` border rounded-lg flex flex-col items-center p-5 justify-center text-sm hover:border-primary cursor-pointer hover:bg-blue-50
                        ${uploadedImage.includes(item.imageKitTr) ? 'border-primary' : null} `
                    } onClick={() => onApplyAITransformation(item?.imageKitTr,  isTransformationApplied(item?.imageKitTr))}>
                <item.icon />
                <h2>{item.name}</h2>
            </div>
                ))} 
        </div>
    </div>
  )
}

export default ProductCustomizeStudio