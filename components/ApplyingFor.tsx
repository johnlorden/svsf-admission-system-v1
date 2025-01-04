import { useState } from 'react'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'

export function ApplyingFor({ onComplete }: { onComplete: (data: any) => void }) {
  const [gradeLevel, setGradeLevel] = useState('')
  const [strand, setStrand] = useState('')

  const handleComplete = () => {
    onComplete({ gradeLevel, strand })
  }

  return (
    <div className="space-y-6">
      <div>
        <Label className="text-base">Grade Level</Label>
        <RadioGroup value={gradeLevel} onValueChange={setGradeLevel} className="mt-2">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="kindergarten" id="kindergarten" />
            <Label htmlFor="kindergarten">Kindergarten</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="elementary" id="elementary" />
            <Label htmlFor="elementary">Elementary (Grades 1-6)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="junior-high" id="junior-high" />
            <Label htmlFor="junior-high">Junior High School (Grades 7-10)</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="senior-high" id="senior-high" />
            <Label htmlFor="senior-high">Senior High School (Grades 11-12)</Label>
          </div>
        </RadioGroup>
      </div>

      {gradeLevel === 'senior-high' && (
        <div>
          <Label htmlFor="strand">Strand</Label>
          <Select value={strand} onValueChange={setStrand}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a strand" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="stem">STEM</SelectItem>
              <SelectItem value="abm">ABM</SelectItem>
              <SelectItem value="humss">HUMSS</SelectItem>
              <SelectItem value="gas">GAS</SelectItem>
              <SelectItem value="tvl">TVL</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}

      <Button 
        onClick={handleComplete} 
        disabled={!gradeLevel || (gradeLevel === 'senior-high' && !strand)}
      >
        Next
      </Button>
    </div>
  )
}

