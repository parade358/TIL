using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Data;
using System.Drawing;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Forms;

namespace Login_Project
{
    public partial class frmLogin : Form
    {
        public frmLogin()
        {
            InitializeComponent();
        }

        private void loginBtn_Click(object sender, EventArgs e)
        {

        }

        private void showAddUserBtn_Click(object sender, EventArgs e)
        {
            frmUserAdd frmUserAdd = new frmUserAdd();
            frmUserAdd.ShowDialog();
        }

        private void showFindUserBtn_Click(object sender, EventArgs e)
        {
            frmUserInfoFind frmUserInfoFind = new frmUserInfoFind();
            frmUserInfoFind.ShowDialog();
        }

        private void showUpdateUserBtn_Click(object sender, EventArgs e)
        {
            frmUserUpdate frmUserUpdate = new frmUserUpdate();
            frmUserUpdate.ShowDialog();
        }

        private void showDeleteUserBtn_Click(object sender, EventArgs e)
        {
            frmUserDelete frmUserDelete = new frmUserDelete(); 
            frmUserDelete.ShowDialog();
        }
    }
}
