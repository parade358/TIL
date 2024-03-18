namespace Login_Project
{
    partial class frmLogin
    {
        /// <summary>
        /// 필수 디자이너 변수입니다.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// 사용 중인 모든 리소스를 정리합니다.
        /// </summary>
        /// <param name="disposing">관리되는 리소스를 삭제해야 하면 true이고, 그렇지 않으면 false입니다.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form 디자이너에서 생성한 코드

        /// <summary>
        /// 디자이너 지원에 필요한 메서드입니다. 
        /// 이 메서드의 내용을 코드 편집기로 수정하지 마세요.
        /// </summary>
        private void InitializeComponent()
        {
            this.id = new System.Windows.Forms.TextBox();
            this.password = new System.Windows.Forms.TextBox();
            this.loginBtn = new System.Windows.Forms.Button();
            this.label2 = new System.Windows.Forms.Label();
            this.label3 = new System.Windows.Forms.Label();
            this.label4 = new System.Windows.Forms.Label();
            this.name = new System.Windows.Forms.TextBox();
            this.showAddUserBtn = new System.Windows.Forms.Button();
            this.showFindUserBtn = new System.Windows.Forms.Button();
            this.showUpdateUserBtn = new System.Windows.Forms.Button();
            this.showDeleteUserBtn = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // id
            // 
            this.id.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.id.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.id.ForeColor = System.Drawing.Color.Black;
            this.id.Location = new System.Drawing.Point(171, 51);
            this.id.Name = "id";
            this.id.Size = new System.Drawing.Size(345, 39);
            this.id.TabIndex = 1;
            // 
            // password
            // 
            this.password.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.password.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.password.Location = new System.Drawing.Point(171, 96);
            this.password.Name = "password";
            this.password.PasswordChar = '*';
            this.password.Size = new System.Drawing.Size(345, 39);
            this.password.TabIndex = 2;
            // 
            // loginBtn
            // 
            this.loginBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(204)))), ((int)(((byte)(204)))), ((int)(((byte)(204)))));
            this.loginBtn.FlatAppearance.BorderColor = System.Drawing.Color.Black;
            this.loginBtn.FlatAppearance.BorderSize = 0;
            this.loginBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.loginBtn.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.loginBtn.Location = new System.Drawing.Point(558, 51);
            this.loginBtn.Name = "loginBtn";
            this.loginBtn.Size = new System.Drawing.Size(203, 72);
            this.loginBtn.TabIndex = 3;
            this.loginBtn.Text = "로그인";
            this.loginBtn.UseVisualStyleBackColor = false;
            this.loginBtn.Click += new System.EventHandler(this.loginBtn_Click);
            // 
            // label2
            // 
            this.label2.AutoSize = true;
            this.label2.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.label2.Location = new System.Drawing.Point(66, 51);
            this.label2.Name = "label2";
            this.label2.Size = new System.Drawing.Size(40, 27);
            this.label2.TabIndex = 4;
            this.label2.Text = "ID";
            // 
            // label3
            // 
            this.label3.AutoSize = true;
            this.label3.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.label3.Location = new System.Drawing.Point(66, 96);
            this.label3.Name = "label3";
            this.label3.Size = new System.Drawing.Size(55, 27);
            this.label3.TabIndex = 5;
            this.label3.Text = "PW";
            // 
            // label4
            // 
            this.label4.AutoSize = true;
            this.label4.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.label4.Location = new System.Drawing.Point(66, 141);
            this.label4.Name = "label4";
            this.label4.Size = new System.Drawing.Size(91, 27);
            this.label4.TabIndex = 6;
            this.label4.Text = "NAME";
            // 
            // name
            // 
            this.name.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.name.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.name.Location = new System.Drawing.Point(171, 141);
            this.name.Name = "name";
            this.name.ReadOnly = true;
            this.name.Size = new System.Drawing.Size(345, 39);
            this.name.TabIndex = 7;
            // 
            // showAddUserBtn
            // 
            this.showAddUserBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(204)))), ((int)(((byte)(204)))), ((int)(((byte)(204)))));
            this.showAddUserBtn.FlatAppearance.BorderSize = 0;
            this.showAddUserBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.showAddUserBtn.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.showAddUserBtn.Location = new System.Drawing.Point(558, 129);
            this.showAddUserBtn.Name = "showAddUserBtn";
            this.showAddUserBtn.Size = new System.Drawing.Size(203, 51);
            this.showAddUserBtn.TabIndex = 9;
            this.showAddUserBtn.Text = "사용자 등록";
            this.showAddUserBtn.UseVisualStyleBackColor = false;
            this.showAddUserBtn.Click += new System.EventHandler(this.showAddUserBtn_Click);
            // 
            // showFindUserBtn
            // 
            this.showFindUserBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(204)))), ((int)(((byte)(204)))), ((int)(((byte)(204)))));
            this.showFindUserBtn.FlatAppearance.BorderColor = System.Drawing.Color.Black;
            this.showFindUserBtn.FlatAppearance.BorderSize = 0;
            this.showFindUserBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.showFindUserBtn.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.showFindUserBtn.Location = new System.Drawing.Point(71, 206);
            this.showFindUserBtn.Name = "showFindUserBtn";
            this.showFindUserBtn.Size = new System.Drawing.Size(175, 52);
            this.showFindUserBtn.TabIndex = 10;
            this.showFindUserBtn.Text = "ID/PW 찾기";
            this.showFindUserBtn.UseVisualStyleBackColor = false;
            this.showFindUserBtn.Click += new System.EventHandler(this.showFindUserBtn_Click);
            // 
            // showUpdateUserBtn
            // 
            this.showUpdateUserBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(204)))), ((int)(((byte)(204)))), ((int)(((byte)(204)))));
            this.showUpdateUserBtn.FlatAppearance.BorderColor = System.Drawing.Color.Black;
            this.showUpdateUserBtn.FlatAppearance.BorderSize = 0;
            this.showUpdateUserBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.showUpdateUserBtn.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.showUpdateUserBtn.Location = new System.Drawing.Point(302, 206);
            this.showUpdateUserBtn.Name = "showUpdateUserBtn";
            this.showUpdateUserBtn.Size = new System.Drawing.Size(203, 52);
            this.showUpdateUserBtn.TabIndex = 11;
            this.showUpdateUserBtn.Text = "정보 수정";
            this.showUpdateUserBtn.UseVisualStyleBackColor = false;
            this.showUpdateUserBtn.Click += new System.EventHandler(this.showUpdateUserBtn_Click);
            // 
            // showDeleteUserBtn
            // 
            this.showDeleteUserBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(204)))), ((int)(((byte)(204)))), ((int)(((byte)(204)))));
            this.showDeleteUserBtn.FlatAppearance.BorderColor = System.Drawing.Color.Black;
            this.showDeleteUserBtn.FlatAppearance.BorderSize = 0;
            this.showDeleteUserBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.showDeleteUserBtn.Font = new System.Drawing.Font("굴림", 20.25F, System.Drawing.FontStyle.Bold, System.Drawing.GraphicsUnit.Point, ((byte)(129)));
            this.showDeleteUserBtn.Location = new System.Drawing.Point(558, 206);
            this.showDeleteUserBtn.Name = "showDeleteUserBtn";
            this.showDeleteUserBtn.Size = new System.Drawing.Size(203, 52);
            this.showDeleteUserBtn.TabIndex = 12;
            this.showDeleteUserBtn.Text = "회원 탈퇴";
            this.showDeleteUserBtn.UseVisualStyleBackColor = false;
            this.showDeleteUserBtn.Click += new System.EventHandler(this.showDeleteUserBtn_Click);
            // 
            // frmLogin
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(7F, 12F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.Color.White;
            this.ClientSize = new System.Drawing.Size(826, 310);
            this.Controls.Add(this.showDeleteUserBtn);
            this.Controls.Add(this.showUpdateUserBtn);
            this.Controls.Add(this.showFindUserBtn);
            this.Controls.Add(this.showAddUserBtn);
            this.Controls.Add(this.name);
            this.Controls.Add(this.label4);
            this.Controls.Add(this.label3);
            this.Controls.Add(this.label2);
            this.Controls.Add(this.loginBtn);
            this.Controls.Add(this.password);
            this.Controls.Add(this.id);
            this.ForeColor = System.Drawing.SystemColors.ControlText;
            this.Name = "frmLogin";
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "로그인";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion
        private System.Windows.Forms.TextBox id;
        private System.Windows.Forms.TextBox password;
        private System.Windows.Forms.Button loginBtn;
        private System.Windows.Forms.Label label2;
        private System.Windows.Forms.Label label3;
        private System.Windows.Forms.Label label4;
        private System.Windows.Forms.TextBox name;
        private System.Windows.Forms.Button showAddUserBtn;
        private System.Windows.Forms.Button showFindUserBtn;
        private System.Windows.Forms.Button showUpdateUserBtn;
        private System.Windows.Forms.Button showDeleteUserBtn;
    }
}

