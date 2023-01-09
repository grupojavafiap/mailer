
require('dotenv').config();
const randomUUID  = require('crypto');
const  mysql = require('mysql');
const nodemailer = require('nodemailer');
    
    let transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 587,
        secure: false,
        auth: {
          user: process.env.SMTP_USER, 
          pass: process.env.SMTP_PASS,
        }
    });

    var connection = mysql.createConnection({
        host     : process.env.DB_HOST,
        user     : process.env.DB_USER,
        password : process.env.DB_PASS,
        database : process.env.DB_NAME
    });



exports.handler = async (event) => {

    const findCustomers = async function()
    {
        return new Promise((resolve, reject) => 
        {
            connection.query('SELECT id, name, email FROM `mailer-db`.customer', function (error, results, fields) {
                if (error) reject(error);

                resolve(results);
            });
        })
    }


    const findTemplate = async function()
    {
        return new Promise((resolve, reject) => 
        {
            connection.query('SELECT id, template FROM `mailer-db`.campaign where status = 1 LIMIT  1', function (error, results, fields) {
                if (error) reject(error);

                const  {id, template } = results[0];
                resolve( {id, template });
            });
        })
    }

    const start = async function()
    {
        const customers = await findCustomers();
        const mails = customers.reduce((emails, customer) => `${emails}${customer.email},`, '');

        const dataTemplate = await findTemplate();
    
        const messageId = await sender({mails, message: dataTemplate.template});
        registerLog(customers, messageId, dataTemplate.id);
    }


    const sender = async function (data)
    {
        if(process.env.ENABLE_SENDER === "true")
        {
            let info = await transporter.sendMail({
                from: '"TechShop 👻" <black_friday@techshop.com>', 
                to: data.mails, 
                subject: "Black Friday - TechShop",
                html: data.message,
            });
            console.log("Message sent: %s", info.messageId);
            console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    
            return info.messageId;
        }   

        return randomUUID();
    }


    const registerLog = function(customers, messageId, campaignId)
    {
        if(customers && customers.length)
        {
            for(const customer of customers)
            {
                const dbName = "`mailer-db`.log_send"
                const insert = `INSERT INTO ${dbName} (created, campaign_id, customer_id, messageId) VALUES(CURRENT_TIMESTAMP(), ${campaignId}, ${customer.id}, '${messageId}')`;
                
                connection.query(insert, function (error, results) {
                    if (error) {console.log("error ", error)}
    
                    return results;
                });
            }
            
        }
    }
    
    await start();

    const response = {
        statusCode: 200,
        body: 'success'
    }

    return response

}
