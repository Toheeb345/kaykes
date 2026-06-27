"use client"
import { Product } from '@/app/_components/PopularProducts'
import { imageKit } from '@/lib/ImageKitInstance'
import { Canvas, FabricImage, Rect } from 'fabric'
import { Crop, Download, GalleryVerticalEnd, ImageOff, ImageUpscale, Upload } from 'lucide-react'
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

const SHIRT_COLORS = [
    { label: 'White', value: '#ffffff' },
    { label: 'Black', value: '#111111' },
    { label: 'Red', value: '#ef4444' },
    { label: 'Blue', value: '#3b82f6' },
    { label: 'Green', value: '#22c55e' },
    { label: 'Yellow', value: '#f59e0b' },
    { label: 'Purple', value: '#a855f7' },
    { label: 'Pink', value: '#ec4899' },
]

const ProductCustomizeStudio = ({ product, setDesignUrl }: Props) => {

    const canvasRef = useRef<any>(null);
    const shirtRef = useRef<HTMLDivElement>(null);
    const shirtCanvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasInstance, setCanvasInstance] = useState<any>(null)
    const [uploadedImage, setUploadedImage] = useState<string>(DEFAULT_IMAGE)
    const [shirtColor, setShirtColor] = useState<string>('#ffffff')
    const [customColor, setCustomColor] = useState<string>('#ffffff')

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
        canvasImageRef.scaleX = 0.3;
        canvasImageRef.scaleY = 0.3;
        canvasInstance.add(canvasImageRef);
        canvasInstance.renderAll();
    }

    const onHandleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
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
            if (uploadedImageUrl) {
                setUploadedImage(uploadedImageUrl);
                canvasInstance.clear();
                canvasInstance.renderAll();
                const canvasImageRef = await FabricImage.fromURL(uploadedImageUrl)
                canvasImageRef.scaleX = 0.3;
                canvasImageRef.scaleY = 0.3;
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
            let currentTransforms = trParam ? trParam.split(',').filter(Boolean) : [];

            if (add) {
                if (!currentTransforms.includes(transformation)) {
                    currentTransforms.push(transformation);
                }
            } else {
                currentTransforms = currentTransforms.filter(t => t !== transformation);
            }

            if (currentTransforms.length > 0) {
                urlObj.searchParams.set('tr', currentTransforms.join(','));
            } else {
                urlObj.searchParams.delete('tr');
            }

            setUploadedImage(urlObj.toString());
        } catch (error) {
            console.error("Invalid URL:", error);
        }
    };

    const isTransformationApplied = (transformation: string) => {
        return uploadedImage?.includes(transformation) ? false : true;
    }

    // Redraw shirt on canvas whenever color changes
    useEffect(() => {
        const canvas = shirtCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = product?.productimage[0]?.url;

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;

            // Draw original shirt
            ctx.drawImage(img, 0, 0);

            // Tint only shirt pixels (transparent areas stay transparent)
            if (shirtColor !== '#ffffff') {
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = shirtColor;
                ctx.fillRect(0, 0, canvas.width, canvas.height);

                // Clip color to shirt shape only
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(img, 0, 0);

                ctx.globalCompositeOperation = 'source-over';
            }
        };
    }, [shirtColor, product]);

    const handleColorChange = (color: string) => {
        setShirtColor(color);
        setCustomColor(color);
    }

    // Download: merges shirt image + canvas design into one image
    const handleDownload = async () => {
        const shirtImgEl = shirtRef.current?.querySelector('img') as HTMLImageElement | null;
        if (!shirtImgEl || !canvasInstance) return;

        // Create an offscreen canvas
        const offscreen = document.createElement('canvas');
        offscreen.width = 400;
        offscreen.height = 400;
        const ctx = offscreen.getContext('2d');
        if (!ctx) return;

        // Draw shirt with color tint
        const shirtImg = new window.Image();
        shirtImg.crossOrigin = 'anonymous';
        shirtImg.src = product?.productimage[0]?.url;

        shirtImg.onload = () => {
            // Draw shirt
            ctx.drawImage(shirtImg, 0, 0, 400, 400);

            // Apply shirt color tint (multiply blend)
            if (shirtColor !== '#ffffff') {
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = shirtColor;
                ctx.fillRect(0, 0, 400, 400);
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(shirtImg, 0, 0, 400, 400);
                ctx.globalCompositeOperation = 'source-over';
            }

            // Draw design from fabric canvas on top (centered)
            const designDataUrl = canvasInstance.toDataURL({ format: 'png', multiplier: 1 });
            const designImg = new window.Image();
            designImg.src = designDataUrl;
            designImg.onload = () => {
                // Center the design on the shirt
                const x = (400 - designImg.width) / 2;
                const y = (400 - designImg.height) / 2 - 20;
                ctx.drawImage(designImg, x, y);

                // Trigger download
                const link = document.createElement('a');
                link.download = 'my-custom-shirt.png';
                link.href = offscreen.toDataURL('image/png');
                link.click();
            }
        }
    }

    return (
        <div className='flex flex-col items-center gap-6'>

            {/* Shirt drawn on canvas with color tint */}
            <div ref={shirtRef} className='flex items-center flex-col h-80 w-80 relative'>
                <canvas
                    id='canvas'
                    ref={canvasRef}
                    className='absolute top-20 left-0 z-10 border rounded-2xl border-dashed'
                />
                <canvas
                    ref={shirtCanvasRef}
                    className='h-96 w-full object-contain relative z-0'
                />
            </div>

            {/* Color picker */}
            <div className='w-full'>
                <p className='text-sm font-medium text-gray-600 mb-2'>Shirt Color</p>
                <div className='flex flex-wrap gap-2 items-center'>
                    {SHIRT_COLORS.map((color) => (
                        <button
                            key={color.value}
                            title={color.label}
                            onClick={() => handleColorChange(color.value)}
                            className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110 ${shirtColor === color.value ? 'border-black scale-110' : 'border-gray-300'}`}
                            style={{ backgroundColor: color.value }}
                        />
                    ))}
                    {/* Custom color input */}
                    <div className='relative'>
                        <input
                            type='color'
                            value={customColor}
                            onChange={(e) => handleColorChange(e.target.value)}
                            className='w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300'
                            title='Custom color'
                        />
                    </div>
                </div>
            </div>

            {/* Upload + AI tools */}
            <div className='flex flex-wrap gap-5'>
                <label htmlFor='uploadImage'>
                    <div className='border rounded-lg flex flex-col items-center p-5 justify-center text-sm hover:border-primary cursor-pointer hover:bg-blue-50'>
                        <Upload />
                        <h2>Upload Image</h2>
                    </div>
                </label>
                <input type='file' id='uploadImage' className='hidden' onChange={onHandleImageUpload} />

                {AITransformOptions.map((item, index) => (
                    <div
                        key={index}
                        className={`border rounded-lg flex flex-col items-center p-5 justify-center text-sm hover:border-primary cursor-pointer hover:bg-blue-50
                        ${uploadedImage.includes(item.imageKitTr) ? 'border-primary' : null}`}
                        onClick={() => onApplyAITransformation(item?.imageKitTr, isTransformationApplied(item?.imageKitTr))}
                    >
                        <item.icon />
                        <h2>{item.name}</h2>
                    </div>
                ))}
            </div>

            {/* Download button */}
            <button
                onClick={handleDownload}
                className='flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors w-full justify-center'
            >
                <Download size={16} />
                Download My Design
            </button>
        </div>
    )
}

export default ProductCustomizeStudio
