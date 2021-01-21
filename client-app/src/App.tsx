import React, {useState, useEffect} from 'react';
import { Header, Icon, List } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import axios from 'axios';

interface IValue {
  id: number;
  name: string;
}

const App:React.FC = () => {
  const [state, setState] = useState<IValue[]>();
  
  useEffect(() => {
    axios.get("http://localhost:5000/api/values")
      .then((response) => {
        setState(response.data)
      })
  }, [])

  return (
    <div>
      <Header as='h2'>
      <Icon name='users' />
      <Header.Content>Reactivities</Header.Content>
      </Header>
      <List>
        {
          state?.map((value, index) => {
            return (
              <List.Item key={index}>{value.name}</List.Item>
            )
          })
        }
        </List>
      
    </div>
  );
}

export default App;
