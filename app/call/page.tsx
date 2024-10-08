"use client"

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Phone, PhoneOff, PhoneIncoming, X, Save } from 'lucide-react';
import { useToast } from "@/hooks/use-toast"

export default function CallPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isCallActive, setIsCallActive] = useState(false);
  const [incomingCall, setIncomingCall] = useState(false);
  const [incomingNumber, setIncomingNumber] = useState('');
  const [cursorPosition, setCursorPosition] = useState(phoneNumber.length);
  const [showSettings, setShowSettings] = useState(false);
  const [config, setConfig] = useState({
    accountSid: '',
    authToken: '',
    twilioNumber: '',
  });
  const inputRef = useRef(null);
  const { toast } = useToast()

  useEffect(() => {
    const savedConfig = localStorage.getItem('phoneConfig');
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig));
    }
  }, []);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.setSelectionRange(cursorPosition, cursorPosition);
    }
  }, [cursorPosition, phoneNumber]);

  const handleNumberInput = (digit) => {
    const newNumber = phoneNumber.slice(0, cursorPosition) + digit + phoneNumber.slice(cursorPosition);
    setPhoneNumber(newNumber);
    setCursorPosition(cursorPosition + 1);
  };

  const handleDelete = () => {
    if (cursorPosition > 0) {
      const newNumber = phoneNumber.slice(0, cursorPosition - 1) + phoneNumber.slice(cursorPosition);
      setPhoneNumber(newNumber);
      setCursorPosition(cursorPosition - 1);
    }
  };

  const handleCall = () => {
    if (phoneNumber && config.accountSid && config.authToken && config.twilioNumber) {
      setIsCallActive(true);
      toast({
        title: "Call Initiated",
        description: `Calling ${phoneNumber} using Twilio number ${config.twilioNumber}...`,
      })
      // Here you would integrate with Twilio to actually make the call
    } else if (!phoneNumber) {
      toast({
        title: "Error",
        description: "Please enter a phone number",
        variant: "destructive",
      })
    } else {
      toast({
        title: "Error",
        description: "Please configure Twilio settings",
        variant: "destructive",
      })
    }
  };

  const handleHangup = () => {
    setIsCallActive(false);
    setIncomingCall(false);
    setIncomingNumber('');
    toast({
      title: "Call Ended",
      description: "The call has been terminated.",
    })
  };

  const handleIncomingCall = () => {
    const randomNumber = Math.floor(Math.random() * 9000000000) + 1000000000;
    setIncomingNumber(randomNumber.toString());
    setIncomingCall(true);
    toast({
      title: "Incoming Call",
      description: `Incoming call from ${randomNumber}`,
    })
  };

  const handleAcceptCall = () => {
    setIsCallActive(true);
    setIncomingCall(false);
    setPhoneNumber(incomingNumber);
    toast({
      title: "Call Accepted",
      description: `You've accepted the call from ${incomingNumber}`,
    })
  };

  const handleSaveConfig = () => {
    localStorage.setItem('phoneConfig', JSON.stringify(config));
    toast({
      title: "Configuration Saved",
      description: "Your Twilio settings have been saved.",
    })
    setShowSettings(false);
  };

  return (
    <div className="flex min-h-screen bg-gray-100 p-4">
      {/* Settings Panel */}
      <div className={`bg-white p-4 rounded-lg shadow-md transition-all duration-300 ease-in-out ${showSettings ? 'w-64 mr-4' : 'w-0 mr-0 overflow-hidden'}`}>
        <h2 className="text-xl font-bold mb-4">Settings</h2>
        <div className="space-y-4">
          <div>
            <Label htmlFor="accountSid">Account SID</Label>
            <Input
              id="accountSid"
              value={config.accountSid}
              onChange={(e) => setConfig({...config, accountSid: e.target.value})}
              placeholder="Enter Account SID"
            />
          </div>
          <div>
            <Label htmlFor="authToken">Auth Token</Label>
            <Input
              id="authToken"
              type="password"
              value={config.authToken}
              onChange={(e) => setConfig({...config, authToken: e.target.value})}
              placeholder="Enter Auth Token"
            />
          </div>
          <div>
            <Label htmlFor="twilioNumber">Twilio Number</Label>
            <Input
              id="twilioNumber"
              value={config.twilioNumber}
              onChange={(e) => setConfig({...config, twilioNumber: e.target.value})}
              placeholder="Enter Twilio Number"
            />
          </div>
          <Button onClick={handleSaveConfig} className="w-full">
            <Save className="mr-2 h-4 w-4" />
            Save Configuration
          </Button>
        </div>
      </div>

      {/* Phone Interface */}
      <div className="flex-grow flex flex-col items-center justify-center">
        <div className="bg-black rounded-3xl p-6 w-full max-w-sm shadow-xl">
          {/* Phone Screen */}
          <div className="bg-gray-200 rounded-lg p-4 mb-4 h-32 flex items-center justify-center relative">
            <input
              ref={inputRef}
              type="text"
              value={incomingCall ? incomingNumber : phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setCursorPosition(e.target.selectionStart);
              }}
              onKeyDown={(e) => {
                if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
                  setTimeout(() => setCursorPosition(e.target.selectionStart), 0);
                }
              }}
              className="text-2xl font-bold bg-transparent w-full text-center focus:outline-none"
              readOnly={incomingCall}
            />
          </div>

          {/* Keypad */}
          <div className="grid grid-cols-3 gap-4 mb-4">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, '*', 0, '#'].map((digit) => (
              <Button
                key={digit}
                onClick={() => handleNumberInput(digit.toString())}
                className="bg-gray-300 hover:bg-gray-400 text-black font-bold py-4 rounded-full"
              >
                {digit}
              </Button>
            ))}
          </div>

          {/* Call Controls */}
          <div className="flex justify-between">
            {!isCallActive && !incomingCall ? (
              <>
                <Button onClick={handleCall} className="bg-green-500 hover:bg-green-600 flex-grow mr-2">
                  <Phone className="mr-2 h-5 w-5" />
                  Call
                </Button>
                <Button onClick={handleDelete} className="bg-red-500 hover:bg-red-600 flex-grow ml-2">
                  <X className="mr-2 h-5 w-5" />
                  Delete
                </Button>
              </>
            ) : (
              <Button onClick={handleHangup} variant="destructive" className="flex-grow mr-2">
                <PhoneOff className="mr-2 h-5 w-5" />
                Hang Up
              </Button>
            )}
            {incomingCall && (
              <Button onClick={handleAcceptCall} className="bg-blue-500 hover:bg-blue-600 flex-grow ml-2">
                <PhoneIncoming className="mr-2 h-5 w-5" />
                Accept
              </Button>
            )}
          </div>

          {/* Simulate Incoming Call (for demo purposes) */}
          <Button onClick={handleIncomingCall} className="mt-4 w-full bg-yellow-500 hover:bg-yellow-600">
            Simulate Incoming Call
          </Button>

          {/* Toggle Settings Button */}
          <Button onClick={() => setShowSettings(!showSettings)} className="mt-4 w-full">
            {showSettings ? 'Hide Settings' : 'Show Settings'}
          </Button>
        </div>
      </div>
    </div>
  );
}