import React, { Component } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import Container from 'react-bootstrap/Container';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'

class App extends Component {
  constructor(props) {
    super(props);
    this.state =({
      prestamos:[],
      pos:null,
      titulo:'Nuevo',
      id:0,
      libro:'',
      usuario:'',
      fec_prestamo: '',
      fec_devolucion:'',
    })
    this.cambioLibro = this.cambioLibro.bind(this);
    this.cambioUsuario = this.cambioUsuario.bind(this);
    this.cambioFecprestamo = this.cambioFecprestamo.bind(this);
    this.cambioFecdevolucion = this.cambioFecdevolucion.bind(this);
    this.mostrar = this.mostrar.bind(this);
    this.eliminar = this.eliminar.bind(this);
    this.guardar = this.guardar.bind(this);
  }

  componentDidMount(){
    axios.get('https://prac03django.herokuapp.com/prestamos/')
    .then(res=> {
      this.setState({prestamos:res.data})
    })
  }

  cambioLibro(e){
    this.setState({
      libro : e.target.value
    })
  }

  cambioUsuario(e){
    this.setState({
      usuario : e.target.value
    })
  }

  cambioFecprestamo(e){
    this.setState({
      fec_prestamo : e.target.value
    })
  }

  cambioFecdevolucion(e){
    this.setState({
      fec_devolucion : e.target.value
    })
  }

  mostrar(cod,index){
    axios.get('https://prac03django.herokuapp.com/prestamos/'+cod)
    .then(res => {
      this.setState({
        pos: index,
        titulo: 'Editar',
        id : res.data.id,
        libro:res.data.libro,
        usuario: res.data.usuario,
        fec_prestamo: res.data.fec_prestamo,
        fec_devolucion: res.data.fec_devolucion
      })
    })
  }

  
  guardar(e){
    e.preventDefault();
    let cod = this.state.id;
    const datos = {
      libro: this.state.libro,
      usuario: this.state.usuario,
      fec_prestamo: this.state.fec_prestamo,
      fec_devolucion: this.state.fec_devolucion
    }
    if(cod>0){
      //edición de un registro
      axios.put('https://prac03django.herokuapp.com/prestamos/'+cod,datos)
      .then(res =>{
        let indx = this.state.pos;
        this.state.prestamos[indx] = res.data;
        var temp = this.state.prestamos;
        this.setState({
          pos:null,
          titulo:'Nuevo',
          id:0,
          libro:'',
          usuario:'',
          fec_prestamo:'',
          fec_devolucion:'',
          prestamos: temp
        });
      }).catch((error) =>{
        console.log(error.toString());
      });
    }else{
      //nuevo registro
      axios.post('https://prac03django.herokuapp.com/prestamos/',datos)
      .then(res => {
        this.state.prestamos.push(res.data);
        var temp = this.state.prestamos;
        this.setState({
          id:0,
          libro:'',
          usuario:'',
          fec_prestamo:'',
          fec_devolucion:'',
          prestamos:temp 
        });
      }).catch((error)=>{
        console.log(error.toString());
      });
    }
  }

  eliminar(cod){
    let rpta = window.confirm("Desea Eliminar?");
    if(rpta){
      axios.delete('https://prac03django.herokuapp.com/prestamos/'+cod)
      .then(res =>{
        var temp = this.state.prestamos.filter((prestamo)=>prestamo.id !== cod);
        this.setState({
          prestamos: temp
        })
      })
    }
  }



  render() {
  return (
    <div>
      <Container>
          <Table striped bordered hover variant="light" class="table table-bordered">
          <thead>
            <tr>
              <th scope="col">Ejemplar</th>
              <th scope="col">Libro</th>
              <th scope="col">Cliente</th>
              <th scope="col">Inicio</th>
              <th scope="col">Fin</th>
              <th scope="col"></th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            {this.state.prestamos.map((prestamo,index) =>{
              return (
                <tr key={prestamo.id}>
                  <td>{prestamo.id}</td>
                  <td>{prestamo.libro}</td>
                  <td>{prestamo.usuario}</td>
                  <td>{prestamo.fec_prestamo}</td>
                  <td>{prestamo.fec_devolucion}</td>
                  <td>
                  <Button variant="success" onClick={()=>this.mostrar(prestamo.id,index)}>Editar</Button>
                  </td>
                  <td>
                  <Button variant="danger" onClick={()=>this.eliminar(prestamo.id,index)}>Eliminar</Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </Table>
        <hr />
        <h1>{this.state.titulo}</h1>
        <Form onSubmit={this.guardar}>
            <input type="hidden" value={this.state.id} />
            <Form.Group className="mb-3">
              <Form.Label>Libro: </Form.Label>
              <Form.Control type="text" value={this.state.libro} onChange={this.cambioLibro} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cliente: </Form.Label>
              <Form.Control type="text" value={this.state.usuario} onChange={this.cambioUsuario} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>F. Prestamos: </Form.Label>
              <Form.Control type="date" value={this.state.fec_prestamo} onChange={this.cambioFecprestamo} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>F. Devolucion: </Form.Label>
              <Form.Control type="date" value={this.state.fec_devolucion} onChange={this.cambioFecdevolucion} />
            </Form.Group>

            <Button variant="primary" type="submit" >
              Guardar
            </Button>
        </Form>
      </Container>
    </div>)
  }

}



export default App;
