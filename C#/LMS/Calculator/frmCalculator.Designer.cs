namespace Calculator
{
    partial class frmCalculator
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
            this.divideBtn = new System.Windows.Forms.Button();
            this.equalsBtn = new System.Windows.Forms.Button();
            this.number0Btn = new System.Windows.Forms.Button();
            this.clearBtn = new System.Windows.Forms.Button();
            this.addBtn = new System.Windows.Forms.Button();
            this.number3Btn = new System.Windows.Forms.Button();
            this.number2Btn = new System.Windows.Forms.Button();
            this.number1Btn = new System.Windows.Forms.Button();
            this.subtractBtn = new System.Windows.Forms.Button();
            this.number6Btn = new System.Windows.Forms.Button();
            this.number5Btn = new System.Windows.Forms.Button();
            this.number4Btn = new System.Windows.Forms.Button();
            this.number7Btn = new System.Windows.Forms.Button();
            this.number8Btn = new System.Windows.Forms.Button();
            this.number9Btn = new System.Windows.Forms.Button();
            this.resultBox = new System.Windows.Forms.TextBox();
            this.multiplyBtn = new System.Windows.Forms.Button();
            this.expressionBox = new System.Windows.Forms.TextBox();
            this.SuspendLayout();
            // 
            // divideBtn
            // 
            this.divideBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.divideBtn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.divideBtn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.divideBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.divideBtn.Location = new System.Drawing.Point(257, 221);
            this.divideBtn.Margin = new System.Windows.Forms.Padding(4);
            this.divideBtn.Name = "divideBtn";
            this.divideBtn.Size = new System.Drawing.Size(73, 32);
            this.divideBtn.TabIndex = 39;
            this.divideBtn.Text = "/";
            this.divideBtn.UseVisualStyleBackColor = false;
            this.divideBtn.Click += new System.EventHandler(this.clickOperatorBtn);
            // 
            // equalsBtn
            // 
            this.equalsBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.equalsBtn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.equalsBtn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.equalsBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.equalsBtn.Location = new System.Drawing.Point(176, 221);
            this.equalsBtn.Margin = new System.Windows.Forms.Padding(4);
            this.equalsBtn.Name = "equalsBtn";
            this.equalsBtn.Size = new System.Drawing.Size(73, 32);
            this.equalsBtn.TabIndex = 38;
            this.equalsBtn.Text = "=";
            this.equalsBtn.UseVisualStyleBackColor = false;
            this.equalsBtn.Click += new System.EventHandler(this.equalsBtn_Click);
            // 
            // number0Btn
            // 
            this.number0Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number0Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number0Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number0Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number0Btn.Location = new System.Drawing.Point(94, 221);
            this.number0Btn.Margin = new System.Windows.Forms.Padding(4);
            this.number0Btn.Name = "number0Btn";
            this.number0Btn.Size = new System.Drawing.Size(73, 32);
            this.number0Btn.TabIndex = 37;
            this.number0Btn.Text = "0";
            this.number0Btn.UseVisualStyleBackColor = false;
            this.number0Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // clearBtn
            // 
            this.clearBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.clearBtn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.clearBtn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.clearBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.clearBtn.Location = new System.Drawing.Point(14, 221);
            this.clearBtn.Margin = new System.Windows.Forms.Padding(4);
            this.clearBtn.Name = "clearBtn";
            this.clearBtn.Size = new System.Drawing.Size(73, 32);
            this.clearBtn.TabIndex = 36;
            this.clearBtn.Text = "C";
            this.clearBtn.UseVisualStyleBackColor = false;
            this.clearBtn.Click += new System.EventHandler(this.clickClearBtn);
            // 
            // addBtn
            // 
            this.addBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.addBtn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.addBtn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.addBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.addBtn.Location = new System.Drawing.Point(257, 181);
            this.addBtn.Margin = new System.Windows.Forms.Padding(4);
            this.addBtn.Name = "addBtn";
            this.addBtn.Size = new System.Drawing.Size(73, 32);
            this.addBtn.TabIndex = 35;
            this.addBtn.Text = "+";
            this.addBtn.UseVisualStyleBackColor = false;
            this.addBtn.Click += new System.EventHandler(this.clickOperatorBtn);
            // 
            // number3Btn
            // 
            this.number3Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number3Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number3Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number3Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number3Btn.Location = new System.Drawing.Point(176, 181);
            this.number3Btn.Margin = new System.Windows.Forms.Padding(4);
            this.number3Btn.Name = "number3Btn";
            this.number3Btn.Size = new System.Drawing.Size(73, 32);
            this.number3Btn.TabIndex = 34;
            this.number3Btn.Text = "3";
            this.number3Btn.UseVisualStyleBackColor = false;
            this.number3Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // number2Btn
            // 
            this.number2Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number2Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number2Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number2Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number2Btn.Location = new System.Drawing.Point(95, 181);
            this.number2Btn.Margin = new System.Windows.Forms.Padding(4);
            this.number2Btn.Name = "number2Btn";
            this.number2Btn.Size = new System.Drawing.Size(73, 32);
            this.number2Btn.TabIndex = 33;
            this.number2Btn.Text = "2";
            this.number2Btn.UseVisualStyleBackColor = false;
            this.number2Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // number1Btn
            // 
            this.number1Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number1Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number1Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number1Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number1Btn.Location = new System.Drawing.Point(14, 181);
            this.number1Btn.Margin = new System.Windows.Forms.Padding(4);
            this.number1Btn.Name = "number1Btn";
            this.number1Btn.Size = new System.Drawing.Size(73, 32);
            this.number1Btn.TabIndex = 32;
            this.number1Btn.Text = "1";
            this.number1Btn.UseVisualStyleBackColor = false;
            this.number1Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // subtractBtn
            // 
            this.subtractBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.subtractBtn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.subtractBtn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.subtractBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.subtractBtn.Location = new System.Drawing.Point(257, 141);
            this.subtractBtn.Margin = new System.Windows.Forms.Padding(4);
            this.subtractBtn.Name = "subtractBtn";
            this.subtractBtn.Size = new System.Drawing.Size(73, 32);
            this.subtractBtn.TabIndex = 31;
            this.subtractBtn.Text = "-";
            this.subtractBtn.UseVisualStyleBackColor = false;
            this.subtractBtn.Click += new System.EventHandler(this.clickOperatorBtn);
            // 
            // number6Btn
            // 
            this.number6Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number6Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number6Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number6Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number6Btn.Location = new System.Drawing.Point(176, 141);
            this.number6Btn.Margin = new System.Windows.Forms.Padding(4);
            this.number6Btn.Name = "number6Btn";
            this.number6Btn.Size = new System.Drawing.Size(73, 32);
            this.number6Btn.TabIndex = 30;
            this.number6Btn.Text = "6";
            this.number6Btn.UseVisualStyleBackColor = false;
            this.number6Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // number5Btn
            // 
            this.number5Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number5Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number5Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number5Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number5Btn.Location = new System.Drawing.Point(95, 141);
            this.number5Btn.Margin = new System.Windows.Forms.Padding(4);
            this.number5Btn.Name = "number5Btn";
            this.number5Btn.Size = new System.Drawing.Size(73, 32);
            this.number5Btn.TabIndex = 29;
            this.number5Btn.Text = "5";
            this.number5Btn.UseVisualStyleBackColor = false;
            this.number5Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // number4Btn
            // 
            this.number4Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number4Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number4Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number4Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number4Btn.Location = new System.Drawing.Point(14, 141);
            this.number4Btn.Margin = new System.Windows.Forms.Padding(4);
            this.number4Btn.Name = "number4Btn";
            this.number4Btn.Size = new System.Drawing.Size(73, 32);
            this.number4Btn.TabIndex = 28;
            this.number4Btn.Text = "4";
            this.number4Btn.UseVisualStyleBackColor = false;
            this.number4Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // number7Btn
            // 
            this.number7Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number7Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number7Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number7Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number7Btn.Location = new System.Drawing.Point(14, 101);
            this.number7Btn.Margin = new System.Windows.Forms.Padding(4, 8, 4, 4);
            this.number7Btn.Name = "number7Btn";
            this.number7Btn.Size = new System.Drawing.Size(73, 32);
            this.number7Btn.TabIndex = 27;
            this.number7Btn.Text = "7";
            this.number7Btn.UseVisualStyleBackColor = false;
            this.number7Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // number8Btn
            // 
            this.number8Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number8Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number8Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number8Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number8Btn.Location = new System.Drawing.Point(95, 101);
            this.number8Btn.Margin = new System.Windows.Forms.Padding(4, 8, 4, 4);
            this.number8Btn.Name = "number8Btn";
            this.number8Btn.Size = new System.Drawing.Size(73, 32);
            this.number8Btn.TabIndex = 26;
            this.number8Btn.Text = "8";
            this.number8Btn.UseVisualStyleBackColor = false;
            this.number8Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // number9Btn
            // 
            this.number9Btn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.number9Btn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.number9Btn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.number9Btn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.number9Btn.Location = new System.Drawing.Point(176, 101);
            this.number9Btn.Margin = new System.Windows.Forms.Padding(4, 8, 4, 4);
            this.number9Btn.Name = "number9Btn";
            this.number9Btn.Size = new System.Drawing.Size(73, 32);
            this.number9Btn.TabIndex = 25;
            this.number9Btn.Text = "9";
            this.number9Btn.UseVisualStyleBackColor = false;
            this.number9Btn.Click += new System.EventHandler(this.clickNumber);
            // 
            // resultBox
            // 
            this.resultBox.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.resultBox.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.resultBox.Font = new System.Drawing.Font("바탕", 15.7F);
            this.resultBox.Location = new System.Drawing.Point(14, 56);
            this.resultBox.Margin = new System.Windows.Forms.Padding(5);
            this.resultBox.Name = "resultBox";
            this.resultBox.ReadOnly = true;
            this.resultBox.Size = new System.Drawing.Size(316, 32);
            this.resultBox.TabIndex = 24;
            this.resultBox.Text = "0";
            this.resultBox.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // multiplyBtn
            // 
            this.multiplyBtn.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.multiplyBtn.BackgroundImageLayout = System.Windows.Forms.ImageLayout.None;
            this.multiplyBtn.FlatAppearance.BorderColor = System.Drawing.Color.FromArgb(((int)(((byte)(172)))), ((int)(((byte)(172)))), ((int)(((byte)(172)))));
            this.multiplyBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.multiplyBtn.Location = new System.Drawing.Point(257, 101);
            this.multiplyBtn.Margin = new System.Windows.Forms.Padding(4, 8, 4, 4);
            this.multiplyBtn.Name = "multiplyBtn";
            this.multiplyBtn.Size = new System.Drawing.Size(73, 32);
            this.multiplyBtn.TabIndex = 23;
            this.multiplyBtn.Text = "*";
            this.multiplyBtn.UseVisualStyleBackColor = false;
            this.multiplyBtn.Click += new System.EventHandler(this.clickOperatorBtn);
            // 
            // expressionBox
            // 
            this.expressionBox.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(225)))), ((int)(((byte)(225)))), ((int)(((byte)(225)))));
            this.expressionBox.BorderStyle = System.Windows.Forms.BorderStyle.FixedSingle;
            this.expressionBox.Font = new System.Drawing.Font("바탕", 15.7F);
            this.expressionBox.Location = new System.Drawing.Point(14, 14);
            this.expressionBox.Margin = new System.Windows.Forms.Padding(5);
            this.expressionBox.Name = "expressionBox";
            this.expressionBox.ReadOnly = true;
            this.expressionBox.Size = new System.Drawing.Size(316, 32);
            this.expressionBox.TabIndex = 22;
            this.expressionBox.Text = "0";
            this.expressionBox.TextAlign = System.Windows.Forms.HorizontalAlignment.Right;
            // 
            // frmCalculator
            // 
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.None;
            this.BackColor = System.Drawing.Color.FromArgb(((int)(((byte)(240)))), ((int)(((byte)(240)))), ((int)(((byte)(240)))));
            this.ClientSize = new System.Drawing.Size(345, 266);
            this.Controls.Add(this.divideBtn);
            this.Controls.Add(this.equalsBtn);
            this.Controls.Add(this.number0Btn);
            this.Controls.Add(this.clearBtn);
            this.Controls.Add(this.addBtn);
            this.Controls.Add(this.number3Btn);
            this.Controls.Add(this.number2Btn);
            this.Controls.Add(this.number1Btn);
            this.Controls.Add(this.subtractBtn);
            this.Controls.Add(this.number6Btn);
            this.Controls.Add(this.number5Btn);
            this.Controls.Add(this.number4Btn);
            this.Controls.Add(this.number7Btn);
            this.Controls.Add(this.number8Btn);
            this.Controls.Add(this.number9Btn);
            this.Controls.Add(this.resultBox);
            this.Controls.Add(this.multiplyBtn);
            this.Controls.Add(this.expressionBox);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.Fixed3D;
            this.Name = "frmCalculator";
            this.RightToLeft = System.Windows.Forms.RightToLeft.No;
            this.StartPosition = System.Windows.Forms.FormStartPosition.CenterScreen;
            this.Text = "Calculator";
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button divideBtn;
        private System.Windows.Forms.Button equalsBtn;
        private System.Windows.Forms.Button number0Btn;
        private System.Windows.Forms.Button clearBtn;
        private System.Windows.Forms.Button addBtn;
        private System.Windows.Forms.Button number3Btn;
        private System.Windows.Forms.Button number2Btn;
        private System.Windows.Forms.Button number1Btn;
        private System.Windows.Forms.Button subtractBtn;
        private System.Windows.Forms.Button number6Btn;
        private System.Windows.Forms.Button number5Btn;
        private System.Windows.Forms.Button number4Btn;
        private System.Windows.Forms.Button number7Btn;
        private System.Windows.Forms.Button number8Btn;
        private System.Windows.Forms.Button number9Btn;
        private System.Windows.Forms.TextBox resultBox;
        private System.Windows.Forms.Button multiplyBtn;
        private System.Windows.Forms.TextBox expressionBox;
    }
}

