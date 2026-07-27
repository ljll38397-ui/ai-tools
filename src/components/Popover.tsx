import {
    Popover,
    PopoverContent,
    PopoverDescription,
    PopoverHeader,
    PopoverTitle,
    PopoverTrigger,
} from "@/components/ui/popover"
import { Button } from "./ui/button"
import {
    Bubble,
    BubbleContent,
    BubbleGroup,
    BubbleReactions,
} from "@/components/ui/bubble"
import { Send } from "lucide-react"
import { useState } from "react"
type messagetype = {
    message: string;
    role: "USER" | "AI";
}
const ChatSection = () => {
    const [messages, setMessages] = useState<messagetype[] | undefined>();
    const [input, setInput] = useState("")
    const sendMessage = () => {
        console.log("send message ajillaa")
        const newMessage: messagetype = {
            message: input,
            role: "USER"
        }
        setMessages((prev) => {
            if (prev) {
                return [...prev, newMessage]
            }
            return [newMessage]
        })

    }
    const handleClick = (e) => {
        console.log(e.key)
        if (e.key === "Enter") {
            sendMessage()
            setInput("")
        }

    }
    return <div>
        <Popover>
            <PopoverTrigger asChild >
                <Button variant="outline">chate</Button>
            </PopoverTrigger>
            <PopoverContent>
                <PopoverHeader>
                    <PopoverTitle>Chate assistant</PopoverTitle>
                    <PopoverDescription asChild>

                        <div className="flex w-full max-w-sm flex-col gap-8 py-12">
                            <Bubble align="end">

                            </Bubble>
                            <BubbleGroup>

                            </BubbleGroup>
                            <Bubble align="end">

                            </Bubble>
                            <Bubble variant="muted" align="end">
                                <BubbleContent>
                                    {messages?.map((chat, index) => (
                                        <div key={index}>
                                            {chat.message}
                                        </div>
                                    ))}
                                </BubbleContent>
                                <div className="flex justify-center gap-1">
                                    <textarea value={input} onKeyDown={handleClick} onChange={(e) => { setInput(e.target.value) }} className="border rounded-[8px] h-8 " placeholder="Type your message..." />
                                    <Button className="w-8 h-8"><Send></Send></Button>
                                </div>

                            </Bubble>
                        </div>

                    </PopoverDescription>
                </PopoverHeader>
            </PopoverContent>
        </Popover>



    </div >




}
export default ChatSection
