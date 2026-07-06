"use client"
import { Product } from '@/app/_components/PopularProducts'
import { imageKit } from '@/lib/ImageKitInstance'
import { Canvas, FabricImage } from 'fabric'
import { Crop, Download, GalleryVerticalEnd, ImageOff, ImageUpscale, Upload } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'

type Props = {
    product: Product,
    setDesignUrl: any
}

const DEFAULT_IMAGE = 'https://ik.imagekit.io/jcnxz8smh/logoipsum-422.png?updatedAt=1781565705839'

const AITransformOptions = [
    { name: 'BG Remove', icon: ImageOff, imageKitTr: 'e-bgremove' },
    { name: 'Upscale', icon: ImageUpscale, imageKitTr: 'e-upscale' },
    { name: 'Smart Crop', icon: Crop, imageKitTr: 'fo-auto' },
    { name: 'Shadow', icon: GalleryVerticalEnd, imageKitTr: 'e-shadow' },
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

// Fixed canvas size — shirt and fabric canvas must match this exactly
const CANVAS_SIZE = 400;

const ProductCustomizeStudio = ({ product, setDesignUrl }: Props) => {
    const canvasRef = useRef<any>(null);
    const shirtCanvasRef = useRef<HTMLCanvasElement>(null);
    const [canvasInstance, setCanvasInstance] = useState<any>(null)
    const [uploadedImage, setUploadedImage] = useState<string>(DEFAULT_IMAGE)
    const [shirtColor, setShirtColor] = useState<string>('#ffffff')
    const [customColor, setCustomColor] = useState<string>('#ffffff')

    // Init Fabric canvas — same size as shirt canvas
    useEffect(() => {
        if (canvasRef.current) {
            const initCanvas = new Canvas(canvasRef.current, {
                width: CANVAS_SIZE,
                height: CANVAS_SIZE,
                backgroundColor: 'transparent'
            })
            initCanvas.renderAll();
            setCanvasInstance(initCanvas);
            return () => { initCanvas.dispose() }
        }
    }, [])

    // Add default image to fabric canvas on init
    useEffect(() => {
        if (canvasInstance) {
            AddImageToCanvas(DEFAULT_IMAGE);
            setDesignUrl(uploadedImage);
        }
    }, [canvasInstance])

    // Normalize any image to a fixed size on the canvas (150x150 max, centered)
    const AddImageToCanvas = async (url: string) => {
        const canvasImageRef = await FabricImage.fromURL(url, { crossOrigin: 'anonymous' })
        canvasInstance.clear();

        const maxSize = 150; // max design size on canvas
        const scaleX = maxSize / canvasImageRef.width!;
        const scaleY = maxSize / canvasImageRef.height!;
        const scale = Math.min(scaleX, scaleY); // keep aspect ratio

        canvasImageRef.scale(scale);

        // Center on canvas
        canvasImageRef.set({
            left: (CANVAS_SIZE - canvasImageRef.getScaledWidth()) / 2,
            top: (CANVAS_SIZE - canvasImageRef.getScaledHeight()) / 2,
        });

        canvasInstance.add(canvasImageRef);
        canvasInstance.renderAll();
    }

    // Redraw shirt with color tint
    useEffect(() => {
        const canvas = shirtCanvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = CANVAS_SIZE;
        canvas.height = CANVAS_SIZE;

        const img = new window.Image();
        img.crossOrigin = 'anonymous';
        img.src = product?.productimage[0]?.url;

        img.onload = () => {
            ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
            ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

            if (shirtColor !== '#ffffff') {
                ctx.globalCompositeOperation = 'multiply';
                ctx.fillStyle = shirtColor;
                ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
                ctx.globalCompositeOperation = 'destination-in';
                ctx.drawImage(img, 0, 0, CANVAS_SIZE, CANVAS_SIZE);
                ctx.globalCompositeOperation = 'source-over';
            }
        };
    }, [shirtColor, product]);

    const onHandleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

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
            setDesignUrl(uploadedImageUrl);
            await AddImageToCanvas(uploadedImageUrl);
        }
    }

    const onApplyAITransformation = (transformation: string, add: boolean) => {
        if (!uploadedImage) return;
        try {
            const urlObj = new URL(uploadedImage);
            const trParam = urlObj.searchParams.get('tr') || '';
            let currentTransforms = trParam ? trParam.split(',').filter(Boolean) : [];

            if (add) {
                if (!currentTransforms.includes(transformation)) currentTransforms.push(transformation);
            } else {
                currentTransforms = currentTransforms.filter(t => t !== transformation);
            }

            if (currentTransforms.length > 0) {
                urlObj.searchParams.set('tr', currentTransforms.join(','));
            } else {
                urlObj.searchParams.delete('tr');
            }

            const newUrl = urlObj.toString();
            setUploadedImage(newUrl);
            AddImageToCanvas(newUrl);
        } catch (error) {
            console.error("Invalid URL:", error);
        }
    };

    const isTransformationApplied = (transformation: string) => {
        return uploadedImage?.includes(transformation) ? false : true;
    }

    const handleColorChange = (color: string) => {
        setShirtColor(color);
        setCustomColor(color);
    }

    // Download: composites shirt + design at exact position user left it
    const handleDownload = () => {
        const shirtCanvas = shirtCanvasRef.current;
        if (!shirtCanvas || !canvasInstance) return;

        const offscreen = document.createElement('canvas');
        offscreen.width = CANVAS_SIZE;
        offscreen.height = CANVAS_SIZE;
        const ctx = offscreen.getContext('2d');
        if (!ctx) return;

        // 1. Draw the already-tinted shirt canvas
        ctx.drawImage(shirtCanvas, 0, 0);

        // 2. Get fabric canvas as image (preserves exact position + size of design)
        const designDataUrl = canvasInstance.toDataURL({ format: 'png', multiplier: 1 });
        const designImg = new window.Image();
        designImg.src = designDataUrl;

        designImg.onload = () => {
            // Draw design exactly as it appears — no repositioning
            ctx.drawImage(designImg, 0, 0, CANVAS_SIZE, CANVAS_SIZE);

            const link = document.createElement('a');
            link.download = 'my-custom-shirt.png';
            link.href = offscreen.toDataURL('image/png');
            link.click();
        }
    }

    return (
        <div className='flex flex-col items-center gap-6'>

            {/* Shirt + design canvas stacked — both 400x400 */}
            <div className='relative' style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}>
                {/* Shirt with color tint */}
                <canvas
                    ref={shirtCanvasRef}
                    className='absolute top-0 left-0 z-0'
                    style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                />
                {/* Fabric design canvas — covers full shirt */}
                <canvas
                    id='canvas'
                    ref={canvasRef}
                    className='absolute top-0 left-0 z-10'
                    style={{ width: CANVAS_SIZE, height: CANVAS_SIZE }}
                />
            </div>

            {/* Color picker */}
            <div className='w-full px-4'>
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
                    <input
                        type='color'
                        value={customColor}
                        onChange={(e) => handleColorChange(e.target.value)}
                        className='w-8 h-8 rounded-full cursor-pointer border-2 border-gray-300'
                        title='Custom color'
                    />
                </div>
            </div>

            {/* Upload + AI tools */}
            <div className='flex flex-wrap gap-5 px-4'>
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
                        ${uploadedImage.includes(item.imageKitTr) ? 'border-primary' : ''}`}
                        onClick={() => onApplyAITransformation(item?.imageKitTr, isTransformationApplied(item?.imageKitTr))}
                    >
                        <item.icon />
                        <h2>{item.name}</h2>
                    </div>
                ))}
            </div>

            {/* Download */}
            <button
                onClick={handleDownload}
                className='flex items-center gap-2 bg-black text-white px-6 py-3 rounded-full text-sm font-medium hover:bg-gray-800 transition-colors w-8/12 justify-center md:w-full'
            >
                <Download />
                Download My Design
            </button>
        </div>
    )
}

export default ProductCustomizeStudio
