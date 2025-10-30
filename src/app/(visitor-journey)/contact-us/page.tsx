import Footer from '@/components/Footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'

const ContactPage = () => {
  return (
    <section>
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#FEF4EA] px-5 pt-36 pb-20">
      {/* Header */}
      <div className="mb-12 max-w-[50rem] text-center">
        <h1 className="text-3xl text-[#331400] trialheader mb-4 font-semibold">
          Let us know how we can help.
        </h1>
        <p className="text-[15px] font-light text-gray-700">
          Whether you're curious about features, plans, or need support — just drop us a
          message and we&apos;ll get back to you soon.
        </p>
      </div>

      {/* Contact Form */}
      <div className="w-full max-w-2xl bg-white rounded-[30px] shadow-md p-10 md:p-16 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="trialheader text-[#331400] capitalize text-4xl font-medium">
            Contact
          </h1>
          <p className="text-[14px]">
            Questions, feedback, or support — we&apos;re just a message away.
          </p>
        </div>

        <form className="space-y-4">
          <Input
            placeholder="Full Name"
            className="border-0 border-b border-black w-full placeholder:text-sm focus:ring-0 focus:border-[#7140EB]"
          />
          <Input
            placeholder="Email"
            className="border-0 border-b border-black w-full placeholder:text-sm focus:ring-0 focus:border-[#7140EB]"
          />
          <Textarea
            placeholder="Message"
            rows={10}
            className="border-0 border-b border-black w-full placeholder:text-sm focus:ring-0 focus:border-[#7140EB]"
          />

          <div className="text-center">
            <Button type="submit" className="w-28 font-semibold">
              Submit
            </Button>
          </div>
        </form>
      </div>

      {/* Subscription Section */}
      <div className="mt-20 w-full max-w-3xl p-10 md:p-14 text-center space-y-6">
        <h2 className="text-3xl trialheader font-medium text-[#331400]">
          Subscribe to Our Newsletter
        </h2>
        <p className="text-[13px] text-gray-700">
          Loved by creators, influencers, artists, musicians, coaches, and entrepreneurs worldwide.
        </p>

        <form className="flex flex-col sm:flex-row items-center gap-4 justify-center">
          <Input
            type="email"
            placeholder="Enter your email address"
            className="border-1 border border-black w-full sm:w-auto placeholder:text-sm focus:ring-0 focus:border-[#7140EB]"
          />
          <Button type="submit" className="w-full sm:w-32 font-semibold">
            Subscribe
          </Button>
        </form>
      </div>
    </main>
      <Footer  />

    </section>
  )
}

export default ContactPage

