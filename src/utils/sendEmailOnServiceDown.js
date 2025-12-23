import nodemailer from "nodemailer";

export const sendEmailOnServiceDown = async (to, summary) => {

  console.log({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  })

  try {

    const transporterDetail = {
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    };

    const transporter = nodemailer.createTransport(transporterDetail);

    // Get all services and identify which are down
    const services = [
      { key: 'landingPage', data: summary.landingPage },
      { key: 'frontend', data: summary.frontend },
      { key: 'backend', data: summary.backend },
      { key: 'database', data: summary.database },
      { key: 'aiBackend', data: summary.aiBackend },
      { key: 'claude', data: summary.claude },
      { key: 'perplexity', data: summary.perplexity }
    ];

    const downServices = services.filter(s => !s.data.ok || !s.data.reachable);
    const downServiceNames = downServices.map(s => s.data.service).join(', ');

    // Generate service status rows
    const serviceRows = services.map(service => {
      const isDown = !service.data.ok || !service.data.reachable;
      const statusColor = isDown ? '#E7363A' : '#22c55e';
      const statusText = isDown ? 'DOWN' : 'UP';
      const operationalText = service.data.reachable ? 'Operational' : 'Not Operational';
      const operationalColor = service.data.reachable ? '#22c55e' : '#E7363A';

      return `
                  <tr style="background-color:${isDown ? '#fff5f5' : '#f0fdf4'};border-left:4px solid ${statusColor};">
                    <td style="padding:12px;font-size:14px;font-weight:600;color:#2B1813;">${service.data.service}</td>
                    <td style="padding:12px;font-size:14px;color:${statusColor};font-weight:600;">${statusText}</td>
                    <td style="padding:12px;font-size:14px;color:${operationalColor};font-weight:600;">${operationalText}</td>
                    <td style="padding:12px;font-size:14px;color:#64748b;">${service.data.latencyMs}ms</td>
                    <td style="padding:12px;font-size:14px;color:#64748b;">${service.data.error || 'N/A'}</td>
                  </tr>
            `;
    }).join('');

    const mailOptions = {
      from: `"Service Monitor" <${process.env.SMTP_USER}>`,
      to,
      subject: `🚨 ALERT: Service(s) Down - ${downServiceNames}`,
      text: `
ALERT: SERVICE(S) DOWN

The following service(s) are currently unreachable:
${downServices.map(s => `- ${s.data.service}`).join('\n')}

Full Service Status Summary:
${services.map(s => {
        const status = (!s.data.ok || !s.data.reachable) ? 'DOWN' : 'UP';
        const operational = s.data.reachable ? 'Operational' : 'Not Operational';
        return `${s.data.service}: ${status} (${operational}) - Latency: ${s.data.latencyMs}ms${s.data.error ? ` - Error: ${s.data.error}` : ''}`;
      }).join('\n')}

Time: ${new Date().toUTCString()}

Immediate action is required.
    `.trim(),
      html: `
<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding:30px 10px;">
          <table width="700" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:6px;overflow:hidden;">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(135deg, #E7363A 0%, #FFA358 100%);color:#ffffff;padding:20px 24px;">
                <h2 style="margin:0;font-size:22px;font-weight:600;">🚨 Service Down Alert</h2>
                <p style="margin:8px 0 0;font-size:14px;opacity:0.95;">${downServiceNames}</p>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:24px;color:#333333;">
                <p style="margin:0 0 20px;font-size:14px;line-height:1.6;">
                  This is an automated alert to inform you that <strong>${downServices.length} service(s)</strong> ${downServices.length === 1 ? 'is' : 'are'} currently <strong style="color:#E7363A;">unreachable</strong>.
                </p>

                <h3 style="margin:0 0 16px;font-size:16px;color:#2B1813;font-weight:600;">Service Status Summary</h3>
                
                <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;border-collapse:collapse;border:1px solid #e2e8f0;">
                  <thead>
                    <tr style="background-color:#2B1813;color:#ffffff;">
                      <th style="padding:12px;text-align:left;font-size:13px;font-weight:600;">Service</th>
                      <th style="padding:12px;text-align:left;font-size:13px;font-weight:600;">Status</th>
                      <th style="padding:12px;text-align:left;font-size:13px;font-weight:600;">Operational</th>
                      <th style="padding:12px;text-align:left;font-size:13px;font-weight:600;">Latency</th>
                      <th style="padding:12px;text-align:left;font-size:13px;font-weight:600;">Error</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${serviceRows}
                  </tbody>
                </table>

                <table cellpadding="0" cellspacing="0" width="100%" style="margin-bottom:20px;">
                  <tr>
                    <td style="padding:8px 0;font-size:14px;"><strong>Detected at:</strong></td>
                    <td style="padding:8px 0;font-size:14px;">${new Date().toUTCString()}</td>
                  </tr>
                </table>

                <p style="margin:20px 0 0;font-size:14px;line-height:1.6;">
                  Please investigate the issue(s) as soon as possible to restore normal service operation.
                </p>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="background:#f4f6f8;padding:12px 24px;text-align:center;font-size:12px;color:#777777;">
                This is an automated message from Service Monitor.<br/>
                Do not reply to this email.
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
    };


    const mailInfo = await transporter.sendMail(mailOptions);

    if (mailInfo) {
      console.log(`ALERT EMAIL HAS BEEN SENT TO : ${to}`);
    }

  } catch (error) {
    console.error("Failed to send alert email:", error.message);
  }
}