import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'

const formSchema = z.object({
  previousSchool: z.string().min(2, {
    message: "Previous school name must be at least 2 characters.",
  }),
  schoolAddress: z.string().min(2, {
    message: "School address must be at least 2 characters.",
  }),
  schoolContact: z.string().optional(),
  lrn: z.string().regex(/^\d{12}$/, {
    message: "LRN must be a 12-digit number.",
  }),
  lastGradeCompleted: z.string().min(1, {
    message: "Please enter the last grade completed.",
  }),
  awards: z.string().optional(),
})

export function EducationalBackground({ onComplete, gradeLevel }: { onComplete: (data: any) => void, gradeLevel: string }) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      previousSchool: "",
      schoolAddress: "",
      schoolContact: "",
      lrn: "",
      lastGradeCompleted: "",
      awards: "",
    },
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    onComplete(values)
  }

  if (gradeLevel === 'kindergarten') {
    return (
      <div>
        <p>Educational background not required for Kindergarten applicants.</p>
        <Button onClick={() => onComplete({})}>Next</Button>
      </div>
    )
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="previousSchool"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Previous School Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schoolAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Address</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="schoolContact"
          render={({ field }) => (
            <FormItem>
              <FormLabel>School Contact (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lrn"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Learner Reference Number (LRN)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="lastGradeCompleted"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Grade Completed</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="awards"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Awards and Achievements (Optional)</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit">Next</Button>
      </form>
    </Form>
  )
}

