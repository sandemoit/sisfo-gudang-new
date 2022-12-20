<?php
defined('BASEPATH') or exit('No direct script access allowed');

class Profile extends CI_Controller
{
    public function __construct()
    {
        parent::__construct();
        is_logged_in();
        $this->load->model('Admin_model');
    }

    public function index()
    {
        $data['user'] = $this->db->get_where('user', ['email' => $this->session->userdata('email')])->row_array();
        $data['title'] = 'Profile';

        $this->load->view('template/header', $data);
        $this->load->view('template/sidebar');
        $this->load->view('template/topbar', $data);
        $this->load->view('profile/profile', $data);
        $this->load->view('template/footer', $data);
    }

    public function edit()
    {
        $id = $this->input->post('id');
        $data = [
            'name' => $this->input->post('name'),
            'nohp' => $this->input->post('nohp')
        ];

        $this->Admin_model->update('user', 'id', $id, $data);
        set_pesan('profile berhasil diupdate');
        redirect('profile');
    }

    public function image()
    {
        $data['user'] = $this->db->get_where('user', ['email' => $this->session->userdata('email')])->row_array();

        $upload_image = $_FILES['image']['name'];
        if ($upload_image) {
            $config['allowed_types'] = 'gif|jpg|png';
            $config['max_size'] = 2048;
            $config['upload_path'] = './assets/images/avatar/';
            $config['encrypt_name'] = TRUE;

            $this->load->library('upload', $config);

            if ($this->upload->do_upload('image')) {
                $new_image = $this->upload->data('file_name');
                $this->db->set('image', $new_image);
            } else {
                echo $this->upload->display_errors();
            }
        }

        set_pesan('Photo berhasil diupdate');
        redirect('profile');
    }

    public function changepassword()
    {
        $data['user'] = $this->db->get_where('user', ['email' => $this->session->userdata('email')])->row_array();
        $data['title'] = 'Change Password';

        $this->form_validation->set_rules('password_lama', 'Password Lama', 'required|trim|min_length[3]');
        $this->form_validation->set_rules('baru_1', 'Password Baru', 'required|trim|min_length[3]|matches[baru_2]');
        $this->form_validation->set_rules('baru_2', 'Konfirmasi Password', 'required|trim|matches[baru_1]');

        if ($this->form_validation->run() == false) {
            $this->load->view('template/header', $data);
            $this->load->view('template/sidebar');
            $this->load->view('template/topbar', $data);
            $this->load->view('profile/changepassword', $data);
            $this->load->view('template/footer', $data);
        } else {
            $password_lama = $this->input->post('password_lama');
            $password_baru = $this->input->post('baru_1');
            if (!password_verify($password_lama, $data['user']['password'])) {
                set_pesan('Password lama salah!', false);
                redirect('profile/changepassword');
            } else {
                if ($password_lama == $password_baru) {
                    set_pesan('Password baru tidak boleh sama dengan kata sandi saat ini!', false);
                    redirect('profile/changepassword');
                } else {
                    // password sudah ok
                    $password_hash = password_hash($password_baru, PASSWORD_DEFAULT);
                    $last = [
                        'last_change_pw' => time()
                    ];
                    $this->db->set($last);
                    $this->db->set('password', $password_hash);
                    $this->db->where('email', $this->session->userdata('email'));
                    $this->db->update('user');

                    set_pesan('Berhasil ganti password!');
                    redirect('profile/changepassword');
                }
            }
        }
    }
}
