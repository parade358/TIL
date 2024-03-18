using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Net.Mail;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;
using System.Net.Mail;
using System.Net;

namespace Login_Project
{
    public partial class frmUserAdd : Form
    {
        public frmUserAdd()
        {
            InitializeComponent();
        }

        public static Random ranNum = new Random();
        public static int checkNum = ranNum.Next(10000000, 99999999);


        private bool IsValidEmail(string email)
        {
            try
            {
                var addr = new System.Net.Mail.MailAddress(email);
                return addr.Address == email;
            }
            catch
            {
                return false;
            }
        }

        private void checkIdBtn_Click(object sender, EventArgs e)
        {
            if(idTextBox.Text == "parade5858")
            {
                MessageBox.Show("이미 사용중인 아이디 입니다.");
            }
            else
            {
                MessageBox.Show("사용가능한 아이디입니다.");
                idTextBox.ReadOnly = true;
            }
        }

        private void password_TextChanged(object sender, EventArgs e)
        {
            bool isValidPassword = Password.Validated(passwordTextBox.Text);

            if (isValidPassword)
            {
                passwordStatusLabel.Text = "사용 가능한 비밀번호입니다.";
                passwordStatusLabel.ForeColor = System.Drawing.Color.Green;
            }
            else
            {
                passwordStatusLabel.Text = "비밀번호는 8자 이상이어야 합니다.";
                passwordStatusLabel.ForeColor = System.Drawing.Color.Red;
            }
        }

        private void emailCheckBtn_Click(object sender, EventArgs e)
        {
            string email = emailTextBox.Text;

            if (!IsValidEmail(email))
            {
                MessageBox.Show("올바른 이메일 주소 형식이 아닙니다.", "오류", MessageBoxButtons.OK, MessageBoxIcon.Error);
                return;
            }

            MailMessage mail = new MailMessage();

            mail.To.Add(email);

            mail.From = new MailAddress("hodoo6539@gmail.com");

            mail.Subject = "회원가입 이메일 인증";

            mail.Body = checkNum.ToString();

            mail.IsBodyHtml = true;

            mail.Priority = MailPriority.High;

            mail.DeliveryNotificationOptions = DeliveryNotificationOptions.OnFailure;

            mail.SubjectEncoding = Encoding.UTF8;
            mail.BodyEncoding = Encoding.UTF8;

            SmtpClient smtp = new SmtpClient();

            smtp.Host = "smtp.gmail.com";

            smtp.Port = 587;

            smtp.Timeout = 100000;
            smtp.UseDefaultCredentials = true;

            smtp.EnableSsl = true;

            smtp.DeliveryMethod = SmtpDeliveryMethod.Network;

            smtp.Credentials = new System.Net.NetworkCredential("hodoo6539@gmail.com", "zvxuupfztuvotnhz");

            try
            {
                smtp.Send(mail);

                smtp.Dispose();

                MessageBox.Show("인증번호 전송 완료", "전송 완료");
            }
            catch(Exception ex)
            {
                MessageBox.Show(ex.ToString());
            }

        }

        private void codeCheckBtn_Click(object sender, EventArgs e)
        {
            if (codeTextBox.Text == checkNum.ToString())
            {
                MessageBox.Show("이메일 인증이 완료되었습니다.", "인증 성공");
                emailTextBox.ReadOnly = true;
                codeTextBox.ReadOnly = true;
            }
            else
            {
                MessageBox.Show("인증 번호가 다릅니다.", "인증 실패");
            }
        }

        private void closeBtn_Click(object sender, EventArgs e)
        {
           this.Close();
        }

        private void addUserBtn_Click(object sender, EventArgs e)
        {

        }
    }
}