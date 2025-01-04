import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const formSchema = z.object({
  fatherName: z.string().min(2, {
    message: "Father's name must be at least 2 characters.",
  }),
  fatherOccupation: z.string().min(2, {
    message: "Father's occupation must be at least 2 characters.",
  }),
  motherName: z.string().min(2, {
    message: "Mother's name must be at least 2 characters.",
  }),
  motherOccupation: z.string().min(2, {
    message: "Mother's occupation must be at least 2 characters.",
  }),
  guardianName: z.string().optional(),
  guardianRelationship: z.string().optional(),
  householdIncome: z.string().min(1, {
    message: "Please select household income range.",
  }),
})

export function FamilyBackground({ onComplete }: { onComplete: (data: any) => void }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fatherName: "",
      fatherOccupation: "",
      motherName: "",
      motherOccupation: "",
      guardianName: "",
      guardianRelationship: "",
      householdIncome: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onComplete(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="fatherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fatherOccupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Father's Occupation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motherName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="motherOccupation"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mother's Occupation</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guardianName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guardian's Name (if applicable)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="guardianRelationship"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Guardian's Relationship (if applicable)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="householdIncome"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Average Household Income</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select income range" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="below_10k">Below ₱10,000</SelectItem>
                  <SelectItem value="10k_30k">₱10,000 - ₱30,000</SelectItem>
                  <SelectItem value="30k_50k">₱30,000 - ₱50,000</SelectItem>
                  <SelectItem value="50k_100k">₱50,000 - ₱100,000</SelectItem>
                  <SelectItem value="above_100k">Above ₱100,000</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}

