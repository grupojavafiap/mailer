# Mailer - Envio de e-mails - Projeto para a disciplina Serverless Architecture - FIAP 

Mailer é uma lambda desenvolvida em nodejs v16 para envio de e-mails.
A lambda se conecta ao MySQL provido pelo RDS da AWS, recupera os e-mails e o conteudo a ser enviado, envia os e-mails para os destinos cadastrados na base de dados, e 
registra cada envio na tabela de logs.


![Mailer](/lambda.png "Diagrama da solução")

## Gatinhos de execução
O Gatinho para execução da lambda é um endpoint exposto por um API Gateway.<br>
`https://12udo2b8f1.execute-api.us-east-1.amazonaws.com/default/mailer`


## SMTP
Para o envio dos e-mails utilizamos um STMP Fake(https://ethereal.email/messages)



## Vídeo demostrativo da solução.



## Desenvolvedores

| RM  | Aluno | Turma |
| ------------- |:-------------:| --------- | 
| 344792      | Benisson dos Santos Lopes     | 1SCJRBB-2022 |
| 344799      | Leonardo Guerra Torres Filho     | 1SCJRBB-2022 |
| 344801      | Lucas Eugenio Ribeiro     | 1SCJRBB-2022 |
| 344794      | César de Lira Santos     | 1SCJRBB-2022 |
| 344791      | Anderson Evangelista     | 1SCJRBB-2022 |