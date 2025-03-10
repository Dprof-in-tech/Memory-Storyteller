// /app/terms/page.js
import Link from 'next/link';
import { format } from 'date-fns';

export default function TermsPage() {
  const currentDate = format(new Date(), 'MMMM d, yyyy');
  
  return (
    <div className="max-w-4xl mx-auto px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/" className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Home
      </Link>
      
      <div className="prose prose-indigo max-w-none">
        <h1 className="text-3xl font-bold mb-8">Terms and Conditions</h1>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          Welcome to Memory Storyteller (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). By accessing or using our service, you agree to these Terms and Conditions and our Privacy Policy.
        </p>
        <p>
          Memory Storyteller is a platform that helps you transform your personal memories into beautiful narrative stories to share with your loved ones. We value your trust and are committed to protecting your privacy and the security of your personal information.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Collection and Usage</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Information We Collect</h3>
        <p>When you use Memory Storyteller, we collect the following types of information:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Account Information</strong>: Your name, email address, password (stored in encrypted format), and optional phone number</li>
          <li><strong>Partner Information</strong>: Your partner&apos;s name and optional phone number (for WhatsApp delivery)</li>
          <li><strong>Memory Content</strong>: The details of memories you share, including dates, locations, descriptions, emotional context, and any photos you upload</li>
          <li><strong>Generated Stories</strong>: Stories created from your memories using AI technology</li>
          <li><strong>Usage Data</strong>: Information about how you interact with our service</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">How We Use Your Information</h3>
        <p>We use your information for the following purposes:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Providing Our Service</strong>: To create and manage your account, process your memories, generate stories, and deliver them as instructed</li>
          <li><strong>Service Improvement</strong>: To analyze usage patterns and improve our platform</li>
          <li><strong>Communication</strong>: To respond to your requests and provide customer support</li>
          <li><strong>Security</strong>: To protect our service and users from fraudulent or harmful activities</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">AI Processing of Your Data</h3>
        <p>Memory Storyteller uses artificial intelligence services (Claude AI and/or ChatGPT) to transform your memory details into narrative stories. This process involves:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Sending the memory details you provide to our AI partners</li>
          <li>Receiving and storing the generated story content</li>
          <li>No permanent storage of your data by our AI partners after processing</li>
        </ol>
        <p>We carefully select AI partners with strong privacy practices and data protection standards.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security and Privacy</h2>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Data Security Measures</h3>
        <p>
          We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. These measures include:
        </p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Encryption of sensitive data</li>
          <li>Secure database protocols</li>
          <li>Regular security assessments</li>
          <li>Limited staff access to user data</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Data Retention</h3>
        <p>
          We retain your information for as long as your account is active or as needed to provide you with our services. You may request deletion of your account and associated data at any time.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Third-Party Services</h3>
        <p>Memory Storyteller uses the following third-party services:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>WhatsApp (via Green API)</strong>: For delivering stories to your partner</li>
          <li><strong>Claude AI (Anthropic)</strong>: For story generation</li>
          <li><strong>ChatGPT (OpenAI)</strong>: For story generation</li>
        </ol>
        <p>
          Each of these services has their own privacy policies and data handling practices. By using our service, you acknowledge and consent to the transfer of your data to these third parties as necessary to provide our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">User Responsibilities</h2>
        <p>By using Memory Storyteller, you agree to:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Provide accurate and truthful information</li>
          <li>Maintain the confidentiality of your account credentials</li>
          <li>Obtain consent from any individuals (including your partner) before sharing their information</li>
          <li>Not use the service for any illegal, harmful, or inappropriate purposes</li>
          <li>Respect the intellectual property and privacy rights of others</li>
        </ol>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Content Ownership and Rights</h2>
        <p>
          You retain ownership of the personal memories and content you provide. By submitting content to Memory Storyteller, you grant us a non-exclusive, royalty-free license to use, process, and transform your content solely for the purpose of providing our service to you.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Modifications to Terms</h2>
        <p>
          We may modify these Terms and Conditions from time to time. We will notify you of any significant changes and, where required by law, seek your consent. Continued use of our service after such modifications constitutes your acceptance of the updated terms.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by law, Memory Storyteller and its affiliates shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use our service.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Information</h2>
        <p>
          If you have any questions or concerns about these Terms and Conditions or our privacy practices, please contact us at [support@memorystoryteller.com].
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Effective Date</h2>
        <p>
          These Terms and Conditions are effective as of {currentDate}.
        </p>
        
        <hr className="my-12 border-gray-300" />
        
        <h1 className="text-3xl font-bold mb-8">Privacy Policy</h1>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Introduction</h2>
        <p>
          This Privacy Policy explains how Memory Storyteller (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;) collects, uses, shares, and protects your personal information when you use our service. We are committed to ensuring the privacy and security of your data.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Personal Information We Collect</h2>
        <p>We collect the following types of personal information:</p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Account Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Name</li>
          <li>Email address</li>
          <li>Password (stored in encrypted form)</li>
          <li>Phone number (optional)</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Partner Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Partner&apos;s name</li>
          <li>Partner&apos;s phone number (optional, for WhatsApp delivery)</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Memory Content</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>Dates, locations, and descriptions of memories</li>
          <li>Emotional content and significance</li>
          <li>Sensory details</li>
          <li>Photos or other media you upload</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Generated Content</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>AI-generated stories based on your memory content</li>
        </ul>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Technical Information</h3>
        <ul className="list-disc pl-5 space-y-1">
          <li>IP address</li>
          <li>Browser type and version</li>
          <li>Device information</li>
          <li>Usage statistics</li>
        </ul>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">How We Use Your Information</h2>
        <p>We use your personal information for:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Account Management</strong>: Creating and managing your account</li>
          <li><strong>Service Provision</strong>: Generating stories from your memories</li>
          <li><strong>Story Delivery</strong>: Sending stories to your partner via WhatsApp</li>
          <li><strong>Service Improvement</strong>: Analyzing usage to enhance our platform</li>
          <li><strong>Customer Support</strong>: Assisting with any issues or questions</li>
          <li><strong>Security</strong>: Protecting against unauthorized access or misuse</li>
        </ol>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Our Commitment to Data Privacy</h2>
        <p>
          We are committed to handling your personal information with care and respect. Your memories are intimate and meaningful, and we treat them with the highest level of privacy protection.
        </p>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">Your Data is Private</h3>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Limited Access</strong>: Only you can access your memories and stories</li>
          <li><strong>No Content Mining</strong>: We do not analyze your content for advertising or unrelated purposes</li>
          <li><strong>No Data Selling</strong>: We never sell your personal information to third parties</li>
          <li><strong>Careful Partner Selection</strong>: We only work with AI and service providers with strong privacy practices</li>
        </ol>
        
        <h3 className="text-xl font-semibold mt-6 mb-3">AI Processing</h3>
        <p>When using AI services (Claude AI or ChatGPT) to generate stories:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Your memory details are transmitted securely to these services</li>
          <li>The AI processes your content to create a narrative story</li>
          <li>The generated story is returned to our service and stored in your account</li>
          <li>These AI providers do not retain your specific memory content after processing</li>
        </ol>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Sharing</h2>
        <p>We share your information with:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Service Providers</strong>: Companies that help us deliver our service (e.g., hosting, database management)</li>
          <li><strong>AI Partners</strong>: Anthropic (Claude) and/or OpenAI (ChatGPT) for story generation</li>
          <li><strong>WhatsApp</strong>: For delivering stories to your partner (via Green API)</li>
          <li><strong>Legal Requirements</strong>: When required by law or to protect our rights</li>
        </ol>
        <p>
          We require all third parties to respect the security of your personal data and to treat it in accordance with the law.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Data Security</h2>
        <p>We implement appropriate security measures to protect your personal information, including:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li>Encryption of sensitive data</li>
          <li>Secure database configuration</li>
          <li>Regular security reviews</li>
          <li>Personnel access controls</li>
          <li>Security incident response procedures</li>
        </ol>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Your Rights</h2>
        <p>Depending on your location, you may have rights regarding your personal information, including:</p>
        <ol className="list-decimal pl-5 space-y-2">
          <li><strong>Access</strong>: Request copies of your personal data</li>
          <li><strong>Correction</strong>: Request correction of inaccurate data</li>
          <li><strong>Deletion</strong>: Request deletion of your personal data</li>
          <li><strong>Restriction</strong>: Request limitation of processing of your data</li>
          <li><strong>Data Portability</strong>: Request transfer of your data</li>
        </ol>
        <p>To exercise these rights, please contact us using the information provided below.</p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Children&apos;s Privacy</h2>
        <p>
          Our service is not intended for children under 16 years of age. We do not knowingly collect personal information from children under 16.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Changes to This Privacy Policy</h2>
        <p>
          We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the effective date.
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please contact us at [support@memorystoryteller.com].
        </p>
        
        <h2 className="text-2xl font-semibold mt-8 mb-4">Effective Date</h2>
        <p>
          This Privacy Policy is effective as of {currentDate}.
        </p>
      </div>
    </div>
  );
}