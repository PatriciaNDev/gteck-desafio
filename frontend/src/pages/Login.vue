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
const email = ref('');
const password = ref('');
const errorMessage = ref('');
const isLoading = ref(false);

const handleLogin = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';

        const response = await api.post('/auth/login', {
            email: email.value,
            password: password.value,
        });
        
        localStorage.setItem('gteck_token', response.data.token);
        router.push('/');
    } catch (error: any) {
        errorMessage.value = error.response?.data?.error ?? 'Erro ao conectar com o servidor.';
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="flex-container">
        <Card style="width: 25rem; overflow: hidden">
            <template #title>Login</template>
            <template #content>
                <form @submit.prevent="handleLogin" class="form-layout">
                
                <div class="field">
                    <label for="email">E-mail</label>
                    <InputText id="email" v-model="email" type="email" fluid placeholder="ex@gteck.com" />
                </div>

                <div class="field">
                    <label for="password">Senha</label>
                    <Password id="password" v-model="password" :feedback="false" toggleMask fluid />
                </div>

                <Message v-if="errorMessage" severity="error" variant="simple">{{ errorMessage }}</Message>

                <Button type="submit" label="Entrar" :loading="isLoading" fluid />
                </form>
            </template>
            
            <template #footer>
                <div class="footer-link">
                    <span>Não tem conta? </span>
                    <router-link to="/register">Cadastre-se aqui</router-link>
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
