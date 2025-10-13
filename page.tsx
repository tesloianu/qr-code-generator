"use client"

import { useState, useEffect } from "react"
import QRCode from "qrcode"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Download, QrCode, Sparkles, Palette, Upload, Copy, Check, Zap, Shield, Smartphone } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function Component() {
  const [text, setText] = useState("")
  const [qrCodeUrl, setQrCodeUrl] = useState("")
  const [size, setSize] = useState("256")
  const [isGenerating, setIsGenerating] = useState(false)
  const [qrType, setQrType] = useState("text")
  const [foregroundColor, setForegroundColor] = useState("#000000")
  const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
  const [errorCorrectionLevel, setErrorCorrectionLevel] = useState("M")
  const [copied, setCopied] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

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
    setIsAnimating(true)
    try {
      const url = await QRCode.toDataURL(text, {
        width: Number.parseInt(size),
        margin: 2,
        color: {
          dark: foregroundColor,
          light: backgroundColor,
        },
        errorCorrectionLevel: errorCorrectionLevel as any,
      })
      setQrCodeUrl(url)
      toast({
        title: "Success!",
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
      setTimeout(() => setIsAnimating(false), 300)
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

  const copyQRCode = async () => {
    if (!qrCodeUrl) return

    try {
      const response = await fetch(qrCodeUrl)
      const blob = await response.blob()
      await navigator.clipboard.write([
        new ClipboardItem({
          'image/png': blob
        })
      ])
      setCopied(true)
      toast({
        title: "Copied!",
        description: "QR code copied to clipboard",
      })
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to copy QR code",
        variant: "destructive",
      })
    }
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
  }, [text, size, foregroundColor, backgroundColor, errorCorrectionLevel])

  // Keyboard shortcut for generating QR code
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
        event.preventDefault()
        if (text.trim() && !isGenerating) {
          generateQRCode()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [text, isGenerating])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>
      
      <div className="relative z-10 max-w-6xl mx-auto p-4">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <QrCode className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Modern QR Generator
            </h1>
          </div>
          <p className="text-gray-600 text-xl max-w-2xl mx-auto leading-relaxed">
            Create stunning, customizable QR codes with advanced features and never-expiring reliability
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md hover:shadow-3xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                QR Configuration
              </CardTitle>
              <CardDescription className="text-base">Customize your QR code with advanced options</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* QR Type Selection */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">QR Code Type</Label>
                <Select value={qrType} onValueChange={setQrType}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="text">📝 Text</SelectItem>
                    <SelectItem value="url">🌐 URL</SelectItem>
                    <SelectItem value="email">📧 Email</SelectItem>
                    <SelectItem value="wifi">📶 Wi-Fi</SelectItem>
                    <SelectItem value="phone">📞 Phone</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Content Input */}
              <div className="space-y-3">
                <Label htmlFor="text" className="text-sm font-medium">
                  {qrType === 'url' ? 'Website URL' : 
                   qrType === 'email' ? 'Email Address' :
                   qrType === 'wifi' ? 'Wi-Fi Details' :
                   qrType === 'phone' ? 'Phone Number' : 'Text Content'}
                </Label>
                <Textarea
                  id="text"
                  placeholder={
                    qrType === 'url' ? 'https://example.com' :
                    qrType === 'email' ? 'contact@example.com' :
                    qrType === 'wifi' ? 'SSID:MyWiFi,Password:12345678' :
                    qrType === 'phone' ? '+1234567890' :
                    'Enter your text content...'
                  }
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="min-h-[100px] resize-none text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  aria-label={`Enter ${qrType} content for QR code generation`}
                />
              </div>

              {/* Advanced Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <Label htmlFor="size" className="text-sm font-medium">Size</Label>
                  <Select value={size} onValueChange={setSize}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="128">128×128 px</SelectItem>
                      <SelectItem value="256">256×256 px</SelectItem>
                      <SelectItem value="512">512×512 px</SelectItem>
                      <SelectItem value="1024">1024×1024 px</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="errorLevel" className="text-sm font-medium">Error Correction</Label>
                  <Select value={errorCorrectionLevel} onValueChange={setErrorCorrectionLevel}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="L">Low (7%)</SelectItem>
                      <SelectItem value="M">Medium (15%)</SelectItem>
                      <SelectItem value="Q">Quartile (25%)</SelectItem>
                      <SelectItem value="H">High (30%)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Color Customization */}
              <div className="space-y-4">
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Palette className="w-4 h-4" />
                  Colors
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="foreground" className="text-xs text-gray-600">Foreground</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="foreground"
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="w-12 h-12 p-1 border-2 border-gray-200 rounded-lg cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className="flex-1 h-12"
                        placeholder="#000000"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="background" className="text-xs text-gray-600">Background</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="background"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="w-12 h-12 p-1 border-2 border-gray-200 rounded-lg cursor-pointer"
                      />
                      <Input
                        type="text"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className="flex-1 h-12"
                        placeholder="#FFFFFF"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={generateQRCode}
                className="w-full h-14 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 focus:outline-none"
                disabled={isGenerating || !text.trim()}
                aria-label={isGenerating ? "Generating QR code, please wait" : "Generate QR code from entered text"}
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" aria-hidden="true"></div>
                    <span>Generating...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Zap className="w-5 h-5" aria-hidden="true" />
                    <span>Generate QR Code</span>
                  </div>
                )}
              </Button>
              
              {/* Keyboard shortcut hint */}
              <p className="text-xs text-gray-500 text-center mt-2">
                💡 Press <kbd className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">Ctrl+Enter</kbd> to generate quickly
              </p>
            </CardContent>
          </Card>

          {/* Preview Section */}
          <Card className="shadow-2xl border-0 bg-white/90 backdrop-blur-md hover:shadow-3xl transition-all duration-300">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg">
                  <QrCode className="w-5 h-5 text-white" />
                </div>
                QR Preview
              </CardTitle>
              <CardDescription className="text-base">Your generated QR code with download options</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                {/* QR Code Display */}
                <div className="relative w-full max-w-sm aspect-square bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden group">
                  {qrCodeUrl ? (
                    <div className={`relative transition-all duration-500 ${isAnimating ? 'scale-110 opacity-80' : 'scale-100 opacity-100'}`}>
                      <img
                        src={qrCodeUrl}
                        alt="Generated QR Code"
                        className="max-w-full max-h-full rounded-xl shadow-2xl"
                      />
                      {isAnimating && (
                        <div className="absolute inset-0 bg-white/20 rounded-xl animate-pulse"></div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center text-gray-400 group-hover:text-gray-500 transition-colors">
                      <div className="relative">
                        <QrCode className="w-20 h-20 mx-auto mb-4 opacity-50 group-hover:opacity-70 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="w-8 h-8 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <p className="text-lg font-medium">QR code will appear here</p>
                      <p className="text-sm mt-1">Enter text above to generate</p>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {qrCodeUrl && (
                  <div className="w-full space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Button 
                        onClick={downloadQRCode} 
                        className="h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-green-300 focus:outline-none"
                        aria-label="Download QR code as PNG file"
                      >
                        <Download className="w-5 h-5 mr-2" aria-hidden="true" />
                        <span>Download</span>
                      </Button>
                      
                      <Button 
                        onClick={copyQRCode}
                        variant="outline"
                        className="h-12 border-2 border-blue-200 text-blue-700 hover:bg-blue-50 hover:border-blue-300 font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] focus:ring-4 focus:ring-blue-300 focus:outline-none"
                        aria-label={copied ? "QR code copied to clipboard" : "Copy QR code to clipboard"}
                      >
                        {copied ? (
                          <>
                            <Check className="w-5 h-5 mr-2" aria-hidden="true" />
                            <span>Copied!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-5 h-5 mr-2" aria-hidden="true" />
                            <span>Copy</span>
                          </>
                        )}
                      </Button>
                    </div>

                    {/* QR Code Info */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-100">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Shield className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-blue-900 mb-2">QR Code Details</h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-blue-800">
                            <div className="flex justify-between">
                              <span>Size:</span>
                              <span className="font-medium">{size}×{size}px</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Format:</span>
                              <span className="font-medium">PNG</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Error Level:</span>
                              <span className="font-medium">{errorCorrectionLevel}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Expires:</span>
                              <span className="font-medium text-green-600">Never</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Section */}
        <div className="mt-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent mb-4">
              Why Choose Our QR Generator?
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Advanced features that make QR code generation simple, powerful, and reliable
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-800">Never Expires</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Generated QR codes are static and permanent, working forever without any expiration
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Download className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-800">Instant Download</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Download QR codes instantly in high-quality PNG format, ready for any use case
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Palette className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-800">Full Customization</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Customize colors, size, error correction, and support multiple QR code types
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-0 bg-white/70 backdrop-blur-sm hover:bg-white/90 hover:shadow-xl transition-all duration-300 group">
              <CardContent className="pt-8 pb-8">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <Smartphone className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-bold text-lg mb-3 text-gray-800">Mobile Optimized</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  Perfectly responsive design that works flawlessly on all devices and screen sizes
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
