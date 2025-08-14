"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { HLA_ALLELES, BLOOD_TYPES, ORGAN_TYPES, SAMPLE_HLA_PROFILES } from "@/lib/hla-data"
import type { Recipient } from "@/lib/types"
import { Heart, User, Droplets, Clock, TestTube } from "lucide-react"

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  age: z.number().min(1).max(120),
  bloodType: z.enum(["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"]),
  organNeeded: z.enum(["kidney", "liver", "heart", "lung", "pancreas"]),
  urgency: z.enum(["low", "medium", "high", "critical"]),
  hlaProfile: z.object({
    "HLA-A": z.tuple([z.string(), z.string()]),
    "HLA-B": z.tuple([z.string(), z.string()]),
    "HLA-C": z.tuple([z.string(), z.string()]),
    "HLA-DRB1": z.tuple([z.string(), z.string()]),
    "HLA-DQB1": z.tuple([z.string(), z.string()]),
    "HLA-DPB1": z.tuple([z.string(), z.string()]),
  }),
})

type FormData = z.infer<typeof formSchema>

interface HLAInputFormProps {
  onSubmit: (recipient: Recipient) => void
}

export function HLAInputForm({ onSubmit }: HLAInputFormProps) {
  const [selectedSample, setSelectedSample] = useState<string | null>(null)

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      age: 45,
      bloodType: "A+",
      organNeeded: "kidney",
      urgency: "medium",
      hlaProfile: {
        "HLA-A": ["", ""],
        "HLA-B": ["", ""],
        "HLA-C": ["", ""],
        "HLA-DRB1": ["", ""],
        "HLA-DQB1": ["", ""],
        "HLA-DPB1": ["", ""],
      },
    },
  })

  const loadSampleData = (sampleType: keyof typeof SAMPLE_HLA_PROFILES) => {
    const sample = SAMPLE_HLA_PROFILES[sampleType]
    setSelectedSample(sampleType)

    // Load sample HLA profile
    form.setValue("hlaProfile", sample)

    // Load sample recipient data based on type
    if (sampleType === "common") {
      form.setValue("name", "John Smith")
      form.setValue("age", 52)
      form.setValue("bloodType", "A+")
      form.setValue("organNeeded", "kidney")
      form.setValue("urgency", "medium")
    } else if (sampleType === "rare") {
      form.setValue("name", "Maria Rodriguez")
      form.setValue("age", 38)
      form.setValue("bloodType", "AB-")
      form.setValue("organNeeded", "liver")
      form.setValue("urgency", "high")
    } else if (sampleType === "mixed") {
      form.setValue("name", "David Chen")
      form.setValue("age", 29)
      form.setValue("bloodType", "O+")
      form.setValue("organNeeded", "heart")
      form.setValue("urgency", "critical")
    }
  }

  const handleSubmit = (data: FormData) => {
    const recipient: Recipient = {
      id: `recipient-${Date.now()}`,
      name: data.name,
      age: data.age,
      bloodType: data.bloodType,
      organNeeded: data.organNeeded,
      urgency: data.urgency,
      hlaProfile: data.hlaProfile,
      waitingSince: new Date().toISOString().split("T")[0],
    }
    onSubmit(recipient)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "low":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "high":
        return "bg-orange-100 text-orange-800"
      case "critical":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Sample Data Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TestTube className="h-5 w-5 text-blue-500" />
            <span>Quick Start with Sample Data</span>
          </CardTitle>
          <CardDescription>Load pre-configured HLA profiles for testing and demonstration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            <Button
              type="button"
              variant={selectedSample === "common" ? "default" : "outline"}
              onClick={() => loadSampleData("common")}
              className="flex items-center space-x-2"
            >
              <Badge variant="secondary">Common</Badge>
              <span>Typical HLA Profile</span>
            </Button>
            <Button
              type="button"
              variant={selectedSample === "rare" ? "default" : "outline"}
              onClick={() => loadSampleData("rare")}
              className="flex items-center space-x-2"
            >
              <Badge variant="secondary">Rare</Badge>
              <span>Uncommon Alleles</span>
            </Button>
            <Button
              type="button"
              variant={selectedSample === "mixed" ? "default" : "outline"}
              onClick={() => loadSampleData("mixed")}
              className="flex items-center space-x-2"
            >
              <Badge variant="secondary">Mixed</Badge>
              <span>Diverse Profile</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          {/* Patient Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <User className="h-5 w-5 text-green-500" />
                <span>Patient Information</span>
              </CardTitle>
              <CardDescription>Basic recipient details and medical requirements</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter patient name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="age"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="Enter age"
                          {...field}
                          onChange={(e) => field.onChange(Number.parseInt(e.target.value) || 0)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="bloodType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Droplets className="h-4 w-4 text-red-500" />
                        <span>Blood Type</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select blood type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {BLOOD_TYPES.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="organNeeded"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span>Organ Needed</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select organ" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {ORGAN_TYPES.map((organ) => (
                            <SelectItem key={organ} value={organ}>
                              {organ.charAt(0).toUpperCase() + organ.slice(1)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2">
                        <Clock className="h-4 w-4 text-orange-500" />
                        <span>Urgency Level</span>
                      </FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select urgency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="low">Low - Stable condition</SelectItem>
                          <SelectItem value="medium">Medium - Moderate need</SelectItem>
                          <SelectItem value="high">High - Urgent need</SelectItem>
                          <SelectItem value="critical">Critical - Life-threatening</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* HLA Profile */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <TestTube className="h-5 w-5 text-purple-500" />
                <span>HLA Profile</span>
              </CardTitle>
              <CardDescription>
                Human Leukocyte Antigen markers for compatibility analysis. Each locus requires two alleles.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {(Object.keys(HLA_ALLELES) as Array<keyof typeof HLA_ALLELES>).map((locus) => (
                <div key={locus} className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline">{locus}</Badge>
                    <span className="text-sm text-muted-foreground">
                      {locus === "HLA-A" && "Class I - Antigen presentation"}
                      {locus === "HLA-B" && "Class I - Antigen presentation"}
                      {locus === "HLA-C" && "Class I - Antigen presentation"}
                      {locus === "HLA-DRB1" && "Class II - Immune response"}
                      {locus === "HLA-DQB1" && "Class II - Immune response"}
                      {locus === "HLA-DPB1" && "Class II - Immune response"}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`hlaProfile.${locus}.0` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allele 1</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={`Select ${locus} allele 1`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {HLA_ALLELES[locus].map((allele) => (
                                <SelectItem key={allele} value={allele}>
                                  {allele}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`hlaProfile.${locus}.1` as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Allele 2</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={`Select ${locus} allele 2`} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {HLA_ALLELES[locus].map((allele) => (
                                <SelectItem key={allele} value={allele}>
                                  {allele}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {locus !== "HLA-DPB1" && <Separator />}
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Submit Button */}
          <div className="flex justify-center">
            <Button type="submit" size="lg" className="bg-red-500 hover:bg-red-600 px-8">
              <Heart className="h-4 w-4 mr-2" />
              Find Compatible Donors
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
