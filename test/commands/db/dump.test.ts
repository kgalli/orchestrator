import {expect, test} from '@oclif/test'

import {env} from '../../helper/test-helper'

describe('db:dump', () => {
  test
    .env(env)
    .stdout()
    .command(['db:dump', '--service', 'api', '-t', 'kgalli-development.dump', '--dry-run'])
    .it('invokes docker cmd to dump database', ctx => {
      const expectedOutput = 'docker run --rm -it --net=host -e PGPASSWORD=kgalli_pw -v $PWD:/opt -w /opt postgres pg_dump -h 127.0.0.1 -p 5436 -U kgalli_us --verbose --no-security-labels --no-owner --if-exists --clean --no-tablespaces --no-privileges --format=custom --file kgalli-development.dump -d kgalli_db'

      expect(ctx.stdout).to.contain(expectedOutput)
    })
})