import {expect, test} from '@oclif/test'

import {env, removeProjectsConfigDefault, writeProjectsConfigDefault} from '../../helper/test-helper'

describe('db:console', () => {
  const expectedDockerCmdPrefix = 'docker run --rm -i -t --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres'

  before(() => writeProjectsConfigDefault())
  after(() => removeProjectsConfigDefault())

  test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '--dry-run'])
    .it('invokes docker cmd to open a console', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} psql -h 127.0.0.1 -p 5436 -U kgalli_us -d kgalli_db`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

  test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '-c', '"SELECT * FROM users LIMIT 1;"', '--dry-run'])
    .it('invokes docker cmd to run given command', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} psql -h 127.0.0.1 -p 5436 -U kgalli_us -d kgalli_db -c "SELECT * FROM users LIMIT 1;"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

  test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '-f', '"db/inserts.sql"', '--dry-run'])
    .it('invokes docker cmd to run commands given by file', ctx => {
      const expectedOutput = `${expectedDockerCmdPrefix} psql -h 127.0.0.1 -p 5436 -U kgalli_us -d kgalli_db -f "db/inserts.sql"`

      expect(ctx.stdout).to.contain(expectedOutput)
    })

  test
    .env(env)
    .stdout()
    .command(['db:console', 'api', '-c', 'SELECT * FROM users LIMIT 1;', '-f', 'db/inserts.sql', '--dry-run'])
    .catch(err => expect(err.message).to.eql('--file= cannot also be provided when using --command='))
    .it('does not allow to use --command option together with --file option')
})
