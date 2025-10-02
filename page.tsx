"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Download, QrCode, Sparkles } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function Component() {
  const [text, setText] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [size, setSize] = useState("256")
  const [isGenerating, setIsGenerating] = useState(false)

  const generateQRCode = async () => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter the text for the QR code",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    try {
      const url = await QRCode.toDataURL(text, {
        width: Number.parseInt(size),
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      })
      setQrCodeUrl(url)
      toast({
        title: "Succes!",
        description: "QR code was generated successfully.",
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Unable to generate QR code.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const downloadQRCode = () => {
    if (!qrCodeUrl) return

    const link = document.createElement("a")
    link.download = `qr-code-${Date.now()}.png`
    link.href = qrCodeUrl
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    toast({
      title: "Downloaded!",
      description: "QR code downloaded successfully",
    })
  }

  useEffect(() => {
    if (text.trim()) {
      const debounceTimer = setTimeout(() => {
        generateQRCode()
      }, 500)
      return () => clearTimeout(debounceTimer)
    } else {
      setQrCodeUrl("")
    }
  }, [text, size])

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <QrCode className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Modern QR Generator
            </h1>
          </div>
          <p className="text-gray-600 text-lg">Create custom QR codes that never expire</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                QR configuration
              </CardTitle>
              <CardDescription>Enter the text or URL for the QR code</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="text">Text or URL</Label>
                <Textarea
                  id="text"
                  placeholder="Enter text, URL or any information..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="size">Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128">128x128 px</SelectItem>
                      <SelectItem value="256">256x256 px</SelectItem>
                      <SelectItem value="512">512x512 px</SelectItem>
                      <SelectItem value="1024">1024x1024 px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button
                onClick={generateQRCode}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                disabled={isGenerating || !text.trim()}
              >
                {isGenerating ? "Generating..." : "Generate QR"}
              </Button>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-xl border-0 bg-white/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>QR Preview</CardTitle>
              <CardDescription>The generated QR code will appear here</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                <div className="w-full max-w-sm aspect-square bg-gray-50 rounded-lg border-2 border-dashed border-gray-200 flex items-center justify-center">
                  {qrCodeUrl ? (
                    <img
                      src={qrCodeUrl || "/placeholder.svg"}
                      alt="Generated QR Code"
                      className="max-w-full max-h-full rounded-lg shadow-lg"
                    />
                  ) : (
                    <div className="text-center text-gray-400">
                      <QrCode className="w-16 h-16 mx-auto mb-2 opacity-50" />
                      <p>The QR code will appear here</p>
                    </div>
                  )}
                </div>

                {qrCodeUrl && (
                  <div className="w-full space-y-4">
                    <Button onClick={downloadQRCode} className="w-full bg-green-600 hover:bg-green-700">
                      <Download className="w-4 h-4 mr-2" />
                      Download QR Code
                    </Button>

                    <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                      <p className="font-medium mb-1">ℹ️ Info:</p>
                      <ul className="space-y-1 text-xs">
                        <li>• QR code never expires</li>
                        <li>
                          • Size: {size}x{size} pixels
                        </li>
                        <li>• Format: High quality PNG</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="text-center border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <QrCode className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold mb-2">No expiration</h3>
              <p className="text-sm text-gray-600">
                Generated QR codes never expire and can be used anytime
              </p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Download className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold mb-2">Instant download</h3>
              <p className="text-sm text-gray-600">Download QR codes in high quality PNG format</p>
            </CardContent>
          </Card>

          <Card className="text-center border-0 bg-white/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold mb-2">Customize</h3>
              <p className="text-sm text-gray-600">Choose the size and level of error correction</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
