<template class="countries">
<div>
  <v-toolbar flat color="white" class="sticky-nav">
      <v-toolbar-title class="text-capitalize">{{ viewNameESP }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn :to="'/trashed?m='+viewName" color="error" flat class="mb-2">PAPELERA</v-btn>
      <v-dialog v-model="dialog" max-width="800px">
        <v-btn slot="activator" color="primary" flat class="mb-2">Nuevos {{ viewNameESP }}</v-btn>
        <v-card>
          <v-card-title>
            <span class="headline">{{ formTitle }}</span>
          </v-card-title>
          <v-card-text>
            <v-container grid-list-md>
              <v-layout wrap>
                <v-flex xs6>
                  <v-text-field type="text" name="Nombre" v-validate="'required'" v-model="editedItem.name" label="Nombre"></v-text-field>                   
                  <span v-show="errors.has('Nombre')">{{ errors.first('Nombre') }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-text-field type="text" name="Iso" v-validate="'required|max:2'" v-model="editedItem.iso" label="Iso"></v-text-field>
                  <span v-show="errors.has('Iso')">{{ errors.first('Iso') }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-text-field type="tel" name="Telefono" v-validate="'required|numeric'" v-model="editedItem.phone" label="Teléfono"></v-text-field>
                  <span v-show="errors.has('Telefono')">{{ errors.first('Telefono') }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-text-field type="text" name="Iva" v-validate="'required|decimal:3'" v-model.number="editedItem.tax" label="Iva"></v-text-field>
                  <span v-show="errors.has('Iva')">{{ errors.first('Iva') }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-text-field type="email" name="Email" v-validate="'required|email'" v-model="editedItem.email" label="Email"></v-text-field>
                  <span v-show="errors.has('Email')">{{ errors.first('Email') }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-text-field type="text" name="skype" v-validate="'required'" v-model="editedItem.skype" label="Skype"></v-text-field>
                  <span v-show="errors.has('skype')">{{ errors.first('skype') }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-select
                    v-model="editedItem.currency"
                    :items="currencies"
                    item-text="name"
                    :error-messages="selectErrors"
                    return-object
                    label="Monedas"
                    required
                    name="Modena" 
                    v-validate="'required'"
                  ></v-select>
                  <span v-show="errors.has('Modena')">{{ errors.first('Modena') }}</span>
                </v-flex>
                <v-flex xs6>
                  <v-checkbox
                    label="Mostrar en listado de portafolios"
                    v-model="editedItem.show_portfolios"
                  ></v-checkbox>
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
        <td >{{ props.item.iso }}</td>
        <td >{{ props.item.phone }}</td>
        <td >{{ props.item.tax }}</td>
        <td >{{ props.item.email }}</td>
        <td >{{ props.item.skype }}</td>
        <td >{{ props.item.currency.iso }}</td>
        
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
    name: 'countries',
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
        viewNameESP: 'Paises'
      }
    },
    methods: {
      editItem (item) {
        this.editedIndex = this.list.indexOf(item)
        this.editedItem = Object.assign({}, item || {
          show_portfolios: true
        })
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
        return this.$store.getters.getAll('countries')
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