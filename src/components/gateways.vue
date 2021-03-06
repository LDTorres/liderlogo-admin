<template class="gateways">
<div>
  <v-toolbar flat color="white" class="sticky-nav">
      <v-toolbar-title hidden-md-and-down class="text-capitalize">{{ viewNameESP }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :to="'/trashed?m='+viewName" color="error" flat class="mb-2">PAPELERA</v-btn>
      <v-dialog v-model="dialog" max-width="800px">
        <v-btn slot="activator" color="primary" flat class="mb-2">Nueva Pasarela</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>

          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs4>
                  <v-text-field type="text" name="Nombre" v-validate="'required'" v-model="editedItem.name" label="Nombre"></v-text-field>                   
                  <span v-show="errors.has('Nombre')">{{ errors.first('Nombre') }}</span>
                </v-flex>
                <v-flex xs4>
                  <v-text-field type="text" name="Codigo" v-validate="'required'" v-model="editedItem.code" label="Codigo"></v-text-field>
                  <span v-show="errors.has('Codigo')">{{ errors.first('Codigo') }}</span>
                </v-flex>
                <v-flex xs4>
                  <v-select
                    multiple
                    v-model="editedItem.currencies"
                    :items="currencies"
                    item-text="name"
                    :error-messages="selectErrors"
                    return-object
                    label="Monedas"
                    required
                    name="Estado" 
                    v-validate="'required'"
                  ></v-select>
                  <span v-show="errors.has('Estado')">{{ errors.first('Estado') }}</span>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    name="Descripcion"
                    label="Descripción"
                    v-model="editedItem.description"
                    v-validate="'required'"
                  ></v-textarea>
                  <span v-show="errors.has('Descripcion')">{{ errors.first('Descripcion') }}</span>
                </v-flex>
                <v-flex xs12>
                  <v-textarea
                    name="Instruciones"
                    label="Instrucciones"
                    v-model="editedItem.instructions"
                    v-validate="'required'"
                  ></v-textarea>
                  <span v-show="errors.has('Instruciones')">{{ errors.first('Instruciones') }}</span>
                </v-flex>
              </v-layout>
            </v-container>
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="error" flat  @click.native="close">Cancelar</v-btn>
            <v-btn color="primary" flat  @click.native="save" :disabled="errors.count() > 0">Guardar</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-toolbar>
  <v-container fluid>
    <v-card>
      <v-card-title>
        <v-layout row wrap>
          <v-flex offset-xs8 xs4>
              <v-text-field
                v-model="search"
                append-icon="search"
                label="Buscar:"
                single-line
                hide-details
              ></v-text-field>
          </v-flex>
        </v-layout>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="list"
        class="elevation-1"
        no-data-text="No hubo resultados"
        :search="search"
      >
      <template slot="items" slot-scope="props">
        <td>{{ props.item.id }}</td>
        <td >{{ props.item.name }}</td>
        <td >{{ props.item.code }}</td>
        <td >{{ props.item.description }}</td>
        <td >{{ props.item.instructions }}</td>
        <td >
          <span v-for="currency in props.item.currencies" :key="currency.iso">
            {{ currency.iso }} 
          </span>
        </td>
        <td class="justify-center layout px-0">
          <v-icon
            title
            class="mr-2" color="primary"
            @click="editItem(props.item)"
          >
            edit
          </v-icon>
          <v-icon
            title
            @click="deleteItem(props.item)" color="error"
          >
            delete
          </v-icon>
        </td>
      </template>
    </v-data-table>
    </v-card>
  </v-container>
</div>
</template>

<script lang="js">
  export default {
    name: 'gateways',
    props: ['search'],
    created () {
      this.$store.dispatch('getAll', {state: this.viewName})
      this.$store.dispatch('getAll', {state: 'currencies'})
    },
    mounted () {
    },
    data () {
      return {
        selectErrors: [],
        pagination: {},
        dialog: false,
        editedIndex: -1,
        viewNameESP: 'Pasarelas'
      }
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.list.indexOf(item)
        this.editedItem = Object.assign({}, item)
        this.dialog = true
      },
      deleteItem (item) {
        item.index = this.list.indexOf(item)
        let params = {
          state: this.viewName,
          item: item
        }

        confirm('Esta seguro que desea eliminar este elemento?') && this.$store.dispatch('deleteOne', params)
      },
      close () {
        this.dialog = false
        setTimeout(() => {
          this.editedItem = Object.assign({}, this.defaultItem)
          this.editedIndex = -1
        }, 300)
      },
      save () {
        this.$validator.validate().then(result => {
          if (!result) {
            alert('Llene los campos correctamente.')
          } else {
            let params = {
              state: this.viewName,
              item: this.editedItem
            }

            if (this.editedIndex > -1) {
              Object.assign(this.list[this.editedIndex], this.editedItem)
              this.$store.dispatch('updateOne', params)
            } else {
              this.$store.dispatch('create', params)
            }
            this.close()
          }
        })
      }
    },
    watch: {
      dialog (val) {
        val || this.close()
      }
    },
    computed: {
      headers () {
        return this.$store.state[this.viewName].struct
      },
      list () {
        return this.$store.getters.getAll('gateways')
      },
      currencies () {
        return this.$store.getters.getAll('currencies')
      },
      pages () {
        if (this.pagination.rowsPerPage == null ||
          this.pagination.totalItems == null
        ) return 0

        return Math.ceil(this.pagination.totalItems / this.pagination.rowsPerPage)
      },
      viewName () {
        return this.$route.name
      },
      formTitle () {
        var title = this.editedIndex === -1 ? 'Nuevo ' : 'Editar '
        return title + this.viewNameESP
      },
      defaultItem () {
        return this.$store.state[this.viewName].defaultItem
      },
      editedItem: {
        get () {
          return this.$store.state[this.viewName].editedItem
        },
        set (value) {
          this.$store.state[this.viewName].editedItem = value
          return this.$store.state[this.viewName].editedItem
        }
      }
    }
}
</script>