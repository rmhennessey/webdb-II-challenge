const express = require('express');
const helmet = require('helmet');
const knex= require('knex');

const server = express();

server.use(express.json());
server.use(helmet());

const knexConfig = {
  client: 'sqlite3',
  useNullAsDefault: true,
  connection: {
    filename: './data/lambda.sqlite3'
  }
};

const db = knex(knexConfig);

// endpoints here

server.get('/api/zoos', (req, res) => {
  db('zoos')
    .then(zoos => {
      res.status(200).json(zoos);
    })
    .catch(error => {
      res.status(500).json(error);
    })
})

server.get('/api/zoos/:id', (req, res) => {
  const roleId = req.params.id;
  
  db('zoos')
    .where({ id: roleId })
    .first()
    .then(zoo => {
      res.status(200).json(zoo);
    })
    .catch(error => {
      res.status(500).json(error);
    })
})

server.post('/api/zoos', (req, res) => {
  db('zoos')
    .insert(req.body)
    .then(ids => {
      const id = ids[0];
      db('zoos')
      .where({ id })
      .first()
      .then(zoo => {
        res.status(201).json(zoo);
      })
    })
      .catch(err => {
        res.status(500).json(err)
      })
});

server.put('/api/zoos/:id', (req, res) => {
  const roleId = req.params.id;
  
  db('zoos')
    .where({ id: roleId })
    .update(req.body)
    .then(count => {
      if (count > 0) {
        res.status(200).json(count);
      } else {
        res.status(404).json({ message: 'Record not found' })
      }
    })
    .catch(error => {
      res.status(500).json(error);
    })
})

server.delete('/api/zoos/:id', (req, res) => {
  const roleId = req.params.id;
  
  db('zoos')
    .where({ id: roleId })
    .del()
    .then(count => {
      if (count > 0) {
        res.status(204).end();
      } else {
        res.status(404).json({ message: 'Record not found' })
      }
    })
    .catch(error => {
      res.status(500).json(error);
    })
})



// server.post('/api/zoos', (req, res) => {
//   db('zoos')
//   .insert(req.body)
//   .then(ids => {
//     const id = ids[0];
//     db('zoos')
//       .where({ id })
//       .first()
//       .then(zoo => {
//         res.status(201).json(zoo);
//       });
//   })
//     .catch(error => {
//       res.status(500).json(error);
//     });
// });

const port = 3300;
server.listen(port, function() {
  console.log(`\n=== Web API Listening on http://localhost:${port} ===\n`);
});
