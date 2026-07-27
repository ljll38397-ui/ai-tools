"use client"

import { Button } from "@/components/ui/button"
import { GoogleGenAI } from "@google/genai"
import Markdown from "react-markdown"
import { useRef, useState } from "react"

const client = new GoogleGenAI({
    apiKey: process.env.NEXT_PUBLIC_Gemini_API_Key,
})
const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => {
            const result = reader.result as string;
            resolve(result.split(",")[1]);
        };
        reader.onerror = reject;
        reader.readAsDataURL(file)
    });
};



const Aifood = () => {
    const [image, setImage] = useState<File>()
    const [previewImage, setPreviewImage] = useState("")
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [response, setResponse] = useState("")
    const handlechange = (e: any) => {
        e.preventDefault();
        setImage(e.target.files[0]);
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        setPreviewImage(imageUrl);
    }
    const handleDivClick = () => {
        fileInputRef.current?.click();
    };
    const handleGenerate = async () => {
        if (!image) {
            return
        }
        const base64 = await fileToBase64(image!);
        try {
            const interaction = await client.models.generateContent({
                model: "gemini-2.5-flash",
                contents: [{
                    inlineData: {
                        mimeType: image!.type,
                        data: base64,



                    },



                },
                {
                    text: `Analyze this food image.
                    Return the result in Markdown:
                    #Food Name
                    ##Ingredients
                    -ingredient 1
                    -ingredient 2
                    ##Estimated Nutrition
                    -Calories:
                    -Protein:
                    -Carbs:
                    -Fat`,

                },
                ],
            });
            console.log(interaction)
            if (interaction.text) {
                setResponse(interaction.text);
            }

        } catch (error) {
            console.log("ERROR", error)
        }
    }
    return (
        <div>
            <div onClick={handleDivClick} className="w-[200px] h-[200px] cursor-pointer bg-slate-100 rounded-xl border-dashed ">

            </div>
            <input hidden type="file" onChange={handlechange} ref={fileInputRef} name="" id="" />
            <Button onClick={handleGenerate}>generate</Button>
            {response && <Markdown>{response}</Markdown>}
            {previewImage && <img src={previewImage} alt="" />}
        </div>
    );
};
export default Aifood
