
package RESTTest;

import java.awt.*;
import java.awt.event.*;

import javax.net.ssl.HttpsURLConnection;
import javax.swing.*;
import java.net.*;
import java.io.*;

public class Main extends JFrame implements ActionListener {

    public static void main(String[] args) {
        new Main();
    }

    private JTextField url;
    private Choice method;
    private JTextArea headers;
    private JTextArea data;
    private JTextArea response;

    public Main() {
        super("REST Test");
        this.setLocation(50, 50);
        this.setSize(1000, 600);
        this.setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        this.setLayout(new BorderLayout());

        JPanel p = new JPanel(new GridLayout(1, 0));
        p.add(new JLabel("URL"));
        p.add(url = new JTextField(70));
        url.setText("http://localhost:1338/office/functions/hello");
        p.add(new JLabel("Method"));
        p.add(method = new Choice());
        method.add("GET");
        method.add("POST");
        this.add(p, BorderLayout.NORTH);

        p = new JPanel(new GridLayout(0, 1));
        JPanel ip = new JPanel();
        ip.add(new JLabel("Headers"));
        ip.add(new JScrollPane(headers = new JTextArea(5, 40)));
        headers.append("X-Parse-Application-Id: WebVoteOffice\n");
        headers.append("X-Parse-REST-API-Key: WebVoteMasterKey\n");
        headers.append("Content-Type: application/json\n");
        ip.add(new JLabel("Data"));
        ip.add(new JScrollPane(data = new JTextArea(5, 40)));
        p.add(ip);

        ip = new JPanel();
        ip.add(new JLabel("Response"));
        ip.add(new JScrollPane(response = new JTextArea(5, 80)));
        response.setEditable(false);
        p.add(ip);
        this.add(p, BorderLayout.CENTER);

        p = new JPanel();
        JButton b = new JButton("Send request");
        b.setActionCommand("Send");
        b.addActionListener(this);
        p.add(b);
        b = new JButton("Reset");
        b.addActionListener(this);
        p.add(b);
        this.add(p, BorderLayout.SOUTH);

        this.setVisible(true);
    }

    private void sendRequest() {
        try { 
            URL u = new URL(url.getText());
            HttpURLConnection uc;
                if(url.getText().startsWith("https"))
                    uc = (HttpsURLConnection) u.openConnection();
                else
                    uc = (HttpURLConnection) u.openConnection();
            uc.setRequestMethod(method.getSelectedItem());

            String[] lines = headers.getText().split("\n");
            for( String l : lines) {
                if(l.trim().length() > 0) {
                    String[] parts = l.split(":", 2);
                    uc.setRequestProperty(parts[0], parts[1]);
                }
            }
            if(method.getSelectedItem().equals("POST")) {
                uc.setDoOutput(true);
                OutputStream os = uc.getOutputStream();
                os.write(data.getText().getBytes());
                os.flush();
                os.close();
            }

            //uc.setRequestProperty("User-Agent","Mozilla/5.0 ( compatible ) ");
            //uc.setRequestProperty("Accept","*/*");
            
            int status = uc.getResponseCode();
            BufferedReader in;
            if(status > 399)
                in = new BufferedReader(new InputStreamReader(uc.getErrorStream()));
            else
                in = new BufferedReader(new InputStreamReader(uc.getInputStream()));
            String inputLine;

            response.setText("");
            while ((inputLine = in.readLine()) != null) {
                lines = inputLine.split(">");
                for(String l : lines) {
                    response.append(l);
                    response.append(">\n");
                }
            }
            in.close();
        } catch(MalformedURLException ex) {
            ex.printStackTrace();
        } catch(IOException ex) {
            ex.printStackTrace();
        }

    }

    public void actionPerformed(ActionEvent e) {
        if(e.getActionCommand().equals("Send")) {
            sendRequest();
        } else if(e.getActionCommand().equals("Reset")) {
            url.setText("");
            headers.setText("");
            response.setText("");
        } else {
            System.err.println("Unknown action command: " + e.getActionCommand());
        }
    }
}