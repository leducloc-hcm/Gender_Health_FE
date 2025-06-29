import { cn } from '@/app/lib/utils'
import { ArrowDown, Bot, MessageCircle, Send, User, X } from 'lucide-react'
import React, { useEffect, useRef, useState } from 'react'
import { Avatar, AvatarFallback } from './ui/avatar'
import { Button } from './ui/button'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Input } from './ui/input'
import { Separator } from './ui/separator'

interface Message {
  id: string
  content: string
  role: 'user' | 'assistant'
  timestamp: Date
}

interface AiChatBoxProps {
  className?: string
}

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || 'your-gemini-api-key-here'
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent'

const SYSTEM_PROMPT = `You are Dr. GenderHealth AI, a professional and compassionate consultant specializing in gender health. Your expertise includes:

- Reproductive health for all genders
- LGBTQ+ health concerns and care
- Hormonal health and transitions
- Sexual health and wellness
- Mental health related to gender identity
- Preventive care and screenings
- Family planning and fertility

Guidelines for your responses:
1. Always maintain a professional, empathetic, and non-judgmental tone
2. Provide evidence-based information while being sensitive to diverse experiences
3. Respect all gender identities and sexual orientations
4. Encourage users to seek professional medical care when appropriate
5. Never provide specific medical diagnoses or replace professional medical advice
6. Use inclusive language and avoid assumptions about gender or sexuality
7. If discussing sensitive topics, be gentle and supportive
8. Remind users that this is informational support, not medical treatment

Remember to be culturally sensitive and acknowledge that gender health needs vary greatly among individuals.`

export default function AiChatBox({ className }: AiChatBoxProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      content:
        "Hello! I'm Dr. GenderHealth AI, your professional consultant for gender health matters. I'm here to provide supportive, evidence-based information about reproductive health, LGBTQ+ health concerns, hormonal health, and more. How can I assist you today?",
      role: 'assistant',
      timestamp: new Date()
    }
  ])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const generateResponse = async (userMessage: string): Promise<string> => {
    try {
      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `${SYSTEM_PROMPT}\n\nUser message: ${userMessage}`
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7,
            topK: 40,
            topP: 0.95,
            maxOutputTokens: 1024
          }
        })
      })

      if (!response.ok) {
        throw new Error('Failed to get response from Gemini API')
      }

      const data = await response.json()
      return (
        data.candidates[0]?.content?.parts[0]?.text ||
        'I apologize, but I encountered an issue processing your request. Please try again or rephrase your question.'
      )
    } catch (error) {
      console.error('Error calling Gemini API:', error)
      return "I apologize, but I'm currently experiencing technical difficulties. Please try again in a moment. If you have urgent health concerns, please consult with a healthcare professional immediately."
    }
  }

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue.trim(),
      role: 'user',
      timestamp: new Date()
    }

    setMessages((prev) => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const aiResponse = await generateResponse(userMessage.content)
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: aiResponse,
        role: 'assistant',
        timestamp: new Date()
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error('Error generating response:', error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content:
          'I apologize, but I encountered an error. Please try again or contact our support team if the issue persists.',
        role: 'assistant',
        timestamp: new Date()
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  if (!isOpen) {
    return (
      <div className='fixed bottom-6 right-6 z-50'>
        <Button
          onClick={() => setIsOpen(true)}
          className='h-14 w-14 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all duration-300'
          size='icon'
        >
          <MessageCircle className='h-6 w-6' />
        </Button>
      </div>
    )
  }

  return (
    <div className={cn('fixed bottom-6 right-6 z-50', className)}>
      <Card
        className={cn(
          'w-80 sm:w-96 transition-all duration-300 shadow-2xl p-0 border-0 bg-white/95 backdrop-blur-sm',
          isMinimized ? 'h-14' : 'h-[32rem]'
        )}
      >
        <CardHeader className='pb-3 bg-gradient-to-r pt-4 from-pink-500 to-purple-600 text-white rounded-t-lg'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center space-x-3'>
              <Avatar className='h-8 w-8 border-2 border-white/30'>
                <AvatarFallback className='bg-white/20 text-white text-xs font-semibold'>
                  <Bot className='h-4 w-4' />
                </AvatarFallback>
              </Avatar>
              <div>
                <CardTitle className='text-sm font-semibold'>Dr. GenderHealth AI</CardTitle>
                <p className='text-xs opacity-90'>Professional Gender Health Consultant</p>
              </div>
            </div>
            <div className='flex items-center space-x-1'>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-white hover:bg-white/20'
                onClick={() => setIsMinimized(!isMinimized)}
              >
                <ArrowDown className='h-4 w-4' />
              </Button>
              <Button
                variant='ghost'
                size='icon'
                className='h-8 w-8 text-white hover:bg-white/20'
                onClick={() => setIsOpen(false)}
              >
                <X className='h-4 w-4' />
              </Button>
            </div>
          </div>
        </CardHeader>

        {!isMinimized && (
          <CardContent className='p-0 flex flex-col h-[calc(32rem-4rem)]'>
            <div className='flex-1 p-4 space-y-4 overflow-y-auto max-h-96'>
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={cn(
                    'flex items-start space-x-3 animate-in slide-in-from-bottom-2',
                    message.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                  )}
                >
                  <Avatar className='h-8 w-8 shrink-0'>
                    <AvatarFallback
                      className={cn(
                        message.role === 'user'
                          ? 'bg-blue-100 text-blue-600'
                          : 'bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600'
                      )}
                    >
                      {message.role === 'user' ? <User className='h-4 w-4' /> : <Bot className='h-4 w-4' />}
                    </AvatarFallback>
                  </Avatar>
                  <div className={cn('flex-1 space-y-1', message.role === 'user' ? 'items-end' : 'items-start')}>
                    <div
                      className={cn(
                        'rounded-lg px-3 py-2 max-w-[85%] text-sm',
                        message.role === 'user' ? 'bg-blue-500 text-white ml-auto' : 'bg-gray-100 text-gray-900'
                      )}
                    >
                      <p className='whitespace-pre-wrap break-words'>{message.content}</p>
                    </div>
                    <p className={cn('text-xs text-gray-500', message.role === 'user' ? 'text-right' : 'text-left')}>
                      {formatTime(message.timestamp)}
                    </p>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className='flex items-start space-x-3'>
                  <Avatar className='h-8 w-8'>
                    <AvatarFallback className='bg-gradient-to-r from-pink-100 to-purple-100 text-purple-600'>
                      <Bot className='h-4 w-4' />
                    </AvatarFallback>
                  </Avatar>
                  <div className='bg-gray-100 rounded-lg px-3 py-2'>
                    <div className='flex space-x-1'>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '0ms' }}
                      ></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '150ms' }}
                      ></div>
                      <div
                        className='w-2 h-2 bg-gray-400 rounded-full animate-bounce'
                        style={{ animationDelay: '300ms' }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <Separator />

            <div className='p-2 rounded-xl bg-gray-50/50'>
              <div className='flex space-x-2'>
                <Input
                  placeholder='Ask about gender health...'
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                  className='flex-1 resize-none border-gray-200 focus:border-purple-300 focus:ring-purple-200'
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim() || isLoading}
                  className='bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-200'
                  size='icon'
                >
                  <Send className='h-4 w-4' />
                </Button>
              </div>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  )
}
