import { InferenceClient } from "@huggingface/inference";
import { Divide } from "lucide-react";
import { useState } from "react";
const FoodAi = () => {
    const client = new InferenceClient(process.env.NEXT_PUBLIC_Ai_tools);

    const [textimage, setTextimage] = useState("")
    const [value, setValue] = useState("")
    const generateInput = (e: any) => {
        setValue(e.target.value)
        console.log("bichsen ", e.target.value)
    }
    const generateImage = async () => {
        const image = await client.textToImage({
            provider: "fal-ai",
            model: "krea/Krea-2-Turbo",
            inputs: value,
        },
            {
                outputType: "dataUrl"
            });
        setTextimage(image)
    }
    return (
        <div className="">
            <input onChange={generateInput} type="text" className="border" />
            <button className="border w-[70px] h-[25px]" onClick={generateImage}>generate</button>
            {textimage && <img src={textimage} alt="" />}
        </div>
    )

}
export default FoodAi
