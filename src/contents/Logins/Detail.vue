<template>
	<div class="detail-page">
		<div class="detail-page-header">
			<!-- Avatar -->
			<div class="detail-page-header-avatar">
				<CompanyLogo :url="form.url" />
			</div>
			<!-- Summary -->
			<div class="detail-page-header-summary">
				<span v-text="getTitle" class="url" />
				<span v-text="form.username" class="email" />
			</div>

			<!-- Edit Btn -->
			<EditBtn v-if="!isEditMode" @click="isEditMode = $event" />
			<ClipboardButton :copy="copyContent" />
			<DeleteBtn @click="onClickDelete" />
		</div>
		<!-- Content -->
		<PerfectScrollbar class="detail-page-content">
			<form class="form" @submit.stop.prevent="onClickUpdate">
				<!-- Title -->
				<FormRowText
					v-model="form.title"
					:title="$t('TITLE')"
					:edit-mode="isEditMode"
				/>

				<!-- URL -->
				<FormRowText
					v-model="form.url"
					:title="$t('URL')"
					:edit-mode="isEditMode"
				/>

				<!-- Username -->
				<FormRowText
					v-model="form.username"
					:title="$t('USERNAME')"
					:edit-mode="isEditMode"
				/>

				<!-- Password -->
				<div class="form-row">
					<label v-text="$t('PASSWORD')" />
					<div class="d-flex flex-items-center">
						<VFormText
							v-if="isEditMode"
							:type="showPass ? 'text' : 'password'"
							:placeholder="$t('ClickToFill')"
							v-model="form.password"
							theme="no-border"
						/>
						<!-- Text -->
						<div v-else class="d-flex px-3 py-2">
							<span v-text="showPass ? form.password : _hidden" class="mr-2" />
						</div>
						<GeneratePassword v-model="form.password" />
						<CheckPass :password="form.password" />
						<ShowPassBtn @click="showPass = $event" />
						<ClipboardButton :copy="form.password" />
					</div>
				</div>

				<!-- Extra -->
				<div class="form-row">
					<div class="d-flex flex-items-end flex-content-between">
						<label v-text="$t('EXTRA')" />
						<div class="d-flex flex-items-center">
							<ClipboardButton :copy="form.extra" />
						</div>
					</div>
					<div class="d-flex">
						<VTextArea
							v-model="form.extra"
							:sensitive="isEditMode || showExtra"
							:placeholder="$t('ClickToFill')"
							:disabled="!showExtra"
						/>
					</div>
				</div>

				<!-- Save & Cancel -->
				<div class="d-flex m-3" v-if="isEditMode">
					<VButton
						class="flex-1"
						theme="text"
						:disabled="loading"
						@click="isEditMode = false"
					>
						{{ $t("Cancel") }}
					</VButton>
					<VButton class="flex-1" type="submit" :loading="loading">
						{{ $t("Save") }}
					</VButton>
				</div>
			</form>
		</PerfectScrollbar>
	</div>
</template>

<script>
import { mapState, mapActions } from "vuex";
import DetailMixin from "@/tools/mixins/detail";

export default {
	mixins: [DetailMixin],

	data() {
		return {
			isEditMode: false,
			showPass: false,
			showExtra: false,
		};
	},

	beforeRouteUpdate(to, from, next) {
		this.isEditMode = false;
		this.showPass = false;
		this.showExtra = false;
		next();
	},

	methods: {
		...mapActions("Logins", ["Delete", "Update"]),

		onClickDelete() {
			const onSuccess = async () => {
				await this.Delete(this.form.id);
				const index = this.ItemList.findIndex(
					(item) => item.id == this.form.id
				);
				if (index !== -1) {
					this.ItemList.splice(index, 1);
				}
				this.$router.push({ name: "Logins", params: { openFirst: true } });
			};

			this.$request(onSuccess, this.$waiters.Logins.Delete);
		},

		async onClickUpdate() {
			const onSuccess = async () => {
				await this.Update({ ...this.form });
				this.$router.push({ name: "Logins", params: { refresh: true } });
			};

			await this.$request(onSuccess, this.$waiters.Logins.Update);
			this.isEditMode = false;
		},
	},

	computed: {
		...mapState("Logins", ["Detail", "ItemList"]),

		loading() {
			return this.$wait.is(this.$waiters.Logins.Update);
		},

		copyContent() {
			return [
				`Title: ${this.form.title}`,
				`URL: ${this.form.url}`,
				`Username: ${this.form.username}`,
				`Password: ${this.form.password}`,
				`Extra: ${this.form.extra}`,
			].join("\n");
		},

		getTitle() {
			return this.form.title || this.form.url;
		},

		_hidden() {
			return "•".repeat(this.form.password.length);
		},
	},
};
</script>
