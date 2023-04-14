import React from 'react'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { api } from '../../services/api'

import { MdEmail, MdLock } from 'react-icons/md'
import { FaUserAlt } from 'react-icons/fa'
import { Header } from '../../components/Header'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'

import { 
    Container,
    Wrapper,
    Column,
    Row,
    Title,
    TitleRegister,
    SubtitleRegister,
    LoginText,
    TenhoText,
    WarningRegister,
} from './styles'

const schema = yup.object({
    name: yup.string()
              .required('Nome é um campo obrigatório'),
    email: yup.string().email('E-mail inválido, tente novamente!')
              .required('E-mail é um campo obrigatório!'),
    password: yup.string().required('Password é um campo obrigatório!')
  }).required();

const Register = () => {
    
    const initialValues = {
        name: '',
        email: '',
        password: ''}
    
    const [values, setValues] = useState(initialValues);
    
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setValues({ ...values, [name]: value });
      };

      const handleReset = () => {
        setValues(initialValues);
      };

    const navigate = useNavigate();

    const { control, handleSubmit, formState: { errors  } } = useForm({
        resolver: yupResolver(schema)
    });

    const handleOnLogin = () => navigate('/login')
    const onSubmit = async (formData) => {
        try{
            const {data} = await api.get(`/users?email=${formData.email}`);
            
            if(data.length && data[0].id){
                alert('Usuário já cadastrado!');
                handleReset();
                return
            }

            // Pega todos os registros da API, para descobrir a ultima ID
            const response = await api.get(`/users`);
            const allRegister = response.data;

            // Varrendo o array e guardando o ultimo id na LastId
            const lastId = allRegister.reduce((max, registro) => Math.max(max, registro.id),0);

            // Definindo a id do novo registro
            const newId = lastId + 1;
            const newRegister = {
                id: newId,
                name: formData.name,
                email: formData.email,
                senha: formData.password
            };

            const postRegister = await api.post('/users', newRegister);
            if (postRegister.status >= 200 || postRegister.status < 400) {
                alert('Cadastro efetuado com sucesso!')
                navigate('/feed');
            }
            
           
        }catch(e){
            alert('Problemas com o nosso servidor, contacte seu administrador de banco de dados!')
        }
    };


  return (
    <>
    <Header />
    <Container>
        <Column>
            <Title>A plataforma para você aprender com experts, dominar as principais tecnologias e entrar mais rápido nas empresas mais desejadas.</Title>
        </Column>
        <Column>
            <Wrapper>
                <TitleRegister>
                    Comece agora grátis
                </TitleRegister>
                <SubtitleRegister>
                    Crie sua conta e make the change._
                </SubtitleRegister>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Input 
                        placeholder="Nome completo" 
                        leftIcon={<FaUserAlt />} 
                        name="name"  
                        control={control} 
                        onChange={handleInputChange}
                        value={values.name}/>
                    {errors.name?.message}
                    <Input 
                        placeholder="E-mail" 
                        leftIcon={<MdEmail />} 
                        name="email"  
                        control={control} 
                        onChange={handleInputChange}
                        value={values.email}/>
                    {errors.email?.message}
                    <Input 
                        type="password" 
                        placeholder="Password" 
                        leftIcon={<MdLock />}  
                        name="password" 
                        control={control} 
                        onChange={handleInputChange}
                        value={values.password}/>
                    {errors.password?.message}
                    <Button title="Criar minha conta" 
                            variant="secondary" 
                            type="submit"/>
                </form>
                <Row>
                    <WarningRegister>
                        Ao clicar em "criar minha conta grátis", declaro que aceito as Políticas de Privacidade e os Termos de Uso da Dio.
                    </WarningRegister>
                </Row>
                <Row>
                    <TenhoText>
                        Já tenho conta. 
                    </TenhoText>
                    <LoginText onClick={handleOnLogin}>
                        Fazer login
                    </LoginText>
                </Row>
            </Wrapper>
        </Column>
    </Container>

    </>
  )
}

export {Register}