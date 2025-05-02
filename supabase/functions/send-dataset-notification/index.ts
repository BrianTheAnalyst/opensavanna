
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface DatasetNotificationRequest {
  userEmail: string;
  datasetTitle: string;
  status: "approved" | "rejected";
  feedback?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userEmail, datasetTitle, status, feedback }: DatasetNotificationRequest = 
      await req.json();

    if (!userEmail || !datasetTitle || !status) {
      throw new Error("Missing required fields: userEmail, datasetTitle, or status");
    }

    const subject = status === "approved" 
      ? "Your dataset has been approved!" 
      : "Your dataset needs attention";

    const htmlContent = status === "approved"
      ? `
        <h1>Congratulations! Your dataset has been approved</h1>
        <p>Good news! Your dataset <strong>${datasetTitle}</strong> has been reviewed and approved by our team.</p>
        <p>It's now publicly available on African Data Commons.</p>
        ${feedback ? `<p><strong>Reviewer feedback:</strong> ${feedback}</p>` : ''}
        <p>Thank you for your contribution to open data in Africa!</p>
        <p>Best regards,<br/>The African Data Commons Team</p>
      `
      : `
        <h1>Your dataset submission requires attention</h1>
        <p>Thank you for submitting <strong>${datasetTitle}</strong> to African Data Commons.</p>
        <p>After careful review, our team has determined that some changes are needed before we can publish your dataset.</p>
        ${feedback ? `<p><strong>Reviewer feedback:</strong> ${feedback}</p>` : '<p>Please resubmit your dataset after making the necessary improvements.</p>'}
        <p>If you have any questions, please reply to this email.</p>
        <p>Best regards,<br/>The African Data Commons Team</p>
      `;

    const emailResponse = await resend.emails.send({
      from: "African Data Commons <notifications@africandata.org>",
      to: [userEmail],
      subject: subject,
      html: htmlContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify(emailResponse), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-dataset-notification function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
