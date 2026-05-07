<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { api } from '../services/api';

import Card from 'primevue/card';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const router = useRouter();

const name = ref('');
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const successMessage = ref('');
const isLoading = ref(false);

const handleRegister = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        successMessage.value = '';

        await api.post('/auth/register', {
            name: name.value,
            email: email.value,
            password: password.value,
        });
        
        successMessage.value = 'Cadastro realizado com sucesso! Redirecionando...';
        setTimeout(() => {
            router.push('/login');
        }, 2000);
        
    } catch (error: any) {
        errorMessage.value = error.response?.data?.error ?? 'Erro ao realizar o cadastro.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex-container">
        <Card style="width: 25rem; overflow: hidden">
            <template #title>Criar Conta</template>
            <template #content>
                <form @submit.prevent="handleRegister" class="form-layout">
                
                <div class="field">
                    <label for="name">Nome Completo</label>
                    <InputText id="name" v-model="name" type="text" fluid placeholder="Ex: João Silva" required />
                </div>

                <div class="field">
                    <label for="email">E-mail</label>
                    <InputText id="email" v-model="email" type="email" fluid placeholder="ex@gteck.com" required />
                </div>

                <div class="field">
                    <label for="password">Senha</label>
                    <Password id="password" v-model="password" :feedback="true" toggleMask fluid promptLabel="Escolha uma senha forte" weakLabel="Fraca" mediumLabel="Média" strongLabel="Forte" required />
                </div>

                <Message v-if="errorMessage" severity="error" variant="simple">{{ errorMessage }}</Message>
                <Message v-if="successMessage" severity="success" variant="simple">{{ successMessage }}</Message>

                <Button type="submit" label="Cadastrar" :loading="isLoading" fluid />
                </form>
            </template>
            
            <template #footer>
                <div class="footer-link">
                    <span>Já tem uma conta? </span>
                    <router-link to="/login">Faça login aqui</router-link>
                </div>
            </template>
        </Card>
    </div>
</template>

<style scoped>
.flex-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.form-layout {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  text-align: center;
  font-size: 0.9rem;
}
</style>
