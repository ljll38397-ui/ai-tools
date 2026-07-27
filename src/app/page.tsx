"use client"
import Image from "next/image";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { File, FileImage, FileText, RotateCcw, RotateCw, Sparkles } from "lucide-react";
import Aifood from "./tools/page";
import { GoogleGenAI } from "@google/genai"
import Markdown from "react-markdown"
import { useRef, useState } from "react"
import FoodAi from "@/components/Text_image";
import ChatSection from "@/components/Popover";
export default function Home() {
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

  const [image, setImage] = useState<File>()
  const [previewImage, setPreviewImage] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [response, setResponse] = useState("")
  const [text, setText] = useState("")
  const [aitext, setAitext] = useState("")
  const handlechange = (e: any) => {
    e.preventDefault();
    setImage(e.target.files[0]);
    const imageUrl = URL.createObjectURL(e.target.files[0]);
    setPreviewImage(imageUrl);
  }
  const Texthandlechange = (e: any) => {
    setText(e.target.value)
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
  const handleRecognize = async () => {
    try {
      const interaction = await client.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{
          text: `hoolnii orts ${text}`
        }]
      });

      if (interaction.text) {
        setAitext(interaction.text)
      }
    } catch (error) {
      console.log("ERROR", error)
    }
  }
  return (

    <div className="flex flex-col justify-center items-center ">
      <Tabs defaultValue="overview" className=" w-[400px]">
        <TabsList>
          <TabsTrigger value="image">Image analysis</TabsTrigger>
          <TabsTrigger value="reports">Ingredient recognition</TabsTrigger>
          <TabsTrigger value="settings">Image creator</TabsTrigger>
        </TabsList>
        <TabsContent value="image">
          <div>

            <div className="flex justify-between" >
              <div className="flex gap-3">
                <Image src="/sparkles.svg" alt="sparkles image" width={18} height={18} />
                <h2>Image analysis</h2>

              </div>
              <div>
                <Button>
                  <RotateCw />
                </Button>
              </div>

            </div>
          </div>


          <div>
            <p>Upload a food photo, and  AI will detect  the Ingredient</p>

          </div>
          <div>
            <div onClick={handleDivClick} className="w-[200px] h-[200px] cursor-pointer bg-slate-100 rounded-xl border-dashed border-2 ">

              <input hidden type="file" onChange={handlechange} ref={fileInputRef} name="" id="" />
              {previewImage && <img src={previewImage} alt="image logo" />}
            </div>
          </div>
          <div className="flex justify-end">

            <Button onClick={handleGenerate}>generate</Button>

          </div>
          <div>
            <FileText className="h-4 w-4"></FileText>
            <h5>Here is the summary</h5>
            <Markdown>{response}</Markdown>
          </div>

        </TabsContent>
        <TabsContent value="reports" className=" w-[580px]">
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Sparkles />
              <h2>Ingredient recognition</h2>
            </div>

            <div>
              <Button>
                <RotateCw></RotateCw>
              </Button>
            </div>
          </div>
          <div>
            <p>Describe the food, and will detect the ingredients.</p>
          </div>
          <div>
            <textarea onChange={Texthandlechange} className="w-[580px] h-[124px] border" placeholder="Орц тодорхойлох" value={text} />
          </div>
          <div className="flex justify-end" >
            <Button onClick={handleRecognize}>Generate</Button>
          </div>
          <div>
            <FileText className="h-4 w-4"></FileText>
            <h2>Identified Ingredients</h2>
          </div>
          <p>Enter your food description to recognize ingredients</p>
          <div>
            {aitext && <Markdown>{aitext}</Markdown>}
          </div>
        </TabsContent>
        <TabsContent value="settings" className="w-[580px]" >
          <div className="flex justify-between">
            <div className="flex gap-2">
              <Sparkles />
              <h2>Food image creator</h2>
            </div>

            <div>
              <Button>
                <RotateCw></RotateCw>
              </Button>
            </div>
          </div>
          <div>
            <p>What food image do you want?Describle it briefly.</p>
          </div>
          <div>
            <textarea className="w-[580px] h-[124px] border" placeholder="Хоолны тайлбар" />
          </div>
          <div className="flex justify-end" >
            <Button>Generate</Button>
          </div>
          <div className="flex gap-2">
            <FileImage></FileImage>
            <h2>Result</h2>
          </div>
          <p>First,enter your text to generate an image.</p>

        </TabsContent>
      </Tabs>
      <div className="flex flex-col items-end justify-end  w-[800px]  h-[300px] ">
        <ChatSection />
      </div>

    </div >



  );
}
