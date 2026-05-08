<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { api } from '../services/api';

import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { useConfirm } from "primevue/useconfirm";
import ConfirmDialog from 'primevue/confirmdialog';
import NewCampaignDialog from '../components/NewCampaignDialog.vue';

interface CampaignRow {
    id: string;
    name: string;
    cost: number;
    revenue: number;
    tax: number;
    expense: number;
    grossProfit: number;
    profit: number;
    roas: number;
}

const campaigns = ref<CampaignRow[]>([]);
const isLoading = ref(false);
const showModal = ref(false);
const errorMessage = ref('');

const currencyFormatter = new Intl.NumberFormat('pt-BR', { 
    style: 'currency', 
    currency: 'BRL' 
});

const formatCurrency = (value: number) => currencyFormatter.format(value);

const fetchCampaigns = async () => {
    try {
        isLoading.value = true;
        errorMessage.value = '';
        const response = await api.get('/campaigns');
        campaigns.value = response.data;
    } catch (error: any) {
        errorMessage.value = error?.response?.data?.error ?? 'Erro ao carregar campanhas.';
    } finally {
        isLoading.value = false;
    }
};

const handleDelete = async (id: string) => {
    try {
        errorMessage.value = '';
        await api.delete(`/campaigns/${id}`);
        await fetchCampaigns();
    } catch (error: any) {
        errorMessage.value = error?.response?.data?.error ?? 'Erro ao remover campanha.';
    }
};

const confirm = useConfirm();
const confirmDelete = (id: string) => {
    confirm.require({
        message: 'Tem certeza que deseja remover esta campanha?',
        header: 'Confirmação',
        icon: 'pi pi-exclamation-triangle',
        rejectLabel: 'Cancelar',
        acceptLabel: 'Deletar',
        acceptClass: 'p-button-danger',
        accept: () => {
            handleDelete(id);
        }
    });
};

onMounted(fetchCampaigns);
</script>

<template>
    <div class="dashboard-container">
        <ConfirmDialog />
        
        <div class="header-actions">
            <h2>Campanhas</h2>
            <Button label="Nova Campanha" icon="pi pi-plus" @click="showModal = true" />
        </div>

        <Message v-if="errorMessage" severity="error">{{ errorMessage }}</Message>

        <DataTable
            :value="campaigns"
            :loading="isLoading"
            stripedRows
            responsiveLayout="stack"
            class="p-datatable-sm shadow-1 campaigns-table"
        >
            <template #empty> Nenhuma campanha encontrada. </template>
            
            <Column field="name">
                <template #header>
                    <span class="name-col-label">Nome</span>
                </template>
                <template #body="{ data }">
                    <span class="name-col-label">{{ data.name }}</span>
                </template>
            </Column>
            
            <Column header="Custo" headerClass="col-center" bodyClass="col-center">
                <template #body="{ data }">
                    {{ formatCurrency(data.cost) }}
                </template>
            </Column>
            
            <Column header="Receita" headerClass="col-center" bodyClass="col-center">
                <template #body="{ data }">
                    {{ formatCurrency(data.revenue) }}
                </template>
            </Column>

            <Column header="Lucro Real" headerClass="col-center" bodyClass="col-center">
                <template #body="{ data }">
                    <span :class="data.profit >= 0 ? 'text-success' : 'text-danger'">
                        {{ formatCurrency(data.profit) }}
                    </span>
                </template>
            </Column>

            <Column field="roas" header="ROAS" headerClass="col-center" bodyClass="col-center">
                <template #body="{ data }">
                    {{ data.roas.toFixed(2) }}x
                </template>
            </Column>

            <Column header="Ações" headerClass="col-center" bodyClass="col-center" :style="{ width: '6rem' }">
                <template #body="{ data }">
                    <Button
                        icon="pi pi-trash"
                        severity="danger"
                        rounded
                        outlined
                        aria-label="Excluir campanha"
                        @click="confirmDelete(data.id)"
                    />
                </template>
            </Column>
        </DataTable>

        <NewCampaignDialog v-model="showModal" @saved="fetchCampaigns" />
    </div>
</template>

<style scoped>
.dashboard-container {
    animation: fadeIn 0.5s ease;
}

.name-col-label {
    display: inline-block;
    padding-inline-start: 1rem;
}

.campaigns-table :deep(thead th) {
    color: var(--p-primary-500, #FF6103);
    font-weight: 600;
    font-size: 1.2rem;
}

.campaigns-table :deep(thead th.col-center),
.campaigns-table :deep(tbody td.col-center) {
    text-align: center;
}

.campaigns-table :deep(thead th.col-center .p-datatable-column-header-content) {
    display: flex;
    justify-content: center;
    width: 100%;
}

.campaigns-table :deep(.p-datatable-column-header-content) {
    color: inherit;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
}

.text-success { color: #22c55e; font-weight: bold; }
.text-danger { color: #ef4444; font-weight: bold; }

@keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
}
</style>
