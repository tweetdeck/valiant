import test from 'ava';
import {createInterval} from '.';

function makeChirp(x) {
  return {
    sortIndex: {
      value: x
    }
  };
}

function sortChirp(a, b) {
  return a.sortIndex.value - b.sortIndex.value;
}

const Interval = createInterval();
const ChirpInterval = createInterval(sortChirp);

test('createInterval is present', t => {
  t.truthy(createInterval);
});

/**
 * Emptyness
 */

test('empty is empty', t => {
  t.truthy(Interval.empty.empty);
});

test('[a,a) is empty', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.excEnd(1)
  );

  t.truthy(i.empty);
});

test('(a,a] is empty', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.incEnd(1)
  );

  t.truthy(i.empty);
});

test('(a,a) is empty', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(1)
  );

  t.truthy(i.empty);
});

test('[b,a] is empty | a < b', t => {
  const i = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(1)
  );

  t.truthy(i.empty);
});

test('[b,a] is empty with custom sort', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(23875)),
    ChirpInterval.incEnd(makeChirp(1))
  );

  t.truthy(i.empty);
});

/**
 * Equality
 */

test('[a,b] is equal to [a,b]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );

  t.truthy(i.equalTo(j));
  t.truthy(j.equalTo(i));
});

test('(a,b) is equal to (a,b)', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );
  const j = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );

  t.truthy(i.equalTo(j));
  t.truthy(j.equalTo(i));
});

test('(b,a) is equal to empty', t => {
  const i = new Interval(
    Interval.excEnd(2),
    Interval.excEnd(1)
  );
  const j = Interval.empty;

  t.truthy(i.equalTo(j));
  t.truthy(j.equalTo(i));
});

test('[b,a] is equal to empty', t => {
  const i = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(1)
  );
  const j = Interval.empty;

  t.truthy(i.equalTo(j));
  t.truthy(j.equalTo(i));
});

test('[a,b] is not equal to [c,d]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(3),
    Interval.incEnd(4)
  );

  t.falsy(i.equalTo(j));
  t.falsy(j.equalTo(i));
});

test('(a,b) is not equal to (c,d)', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );
  const j = new Interval(
    Interval.excEnd(3),
    Interval.excEnd(4)
  );

  t.falsy(i.equalTo(j));
  t.falsy(j.equalTo(i));
});

/**
 * Intersection
 */

// Inclusive

test('[a,d] intersection [b,c] | a < b < c < d = [b,c]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(4)
  );
  const j = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(3)
  );
  const expected = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(3)
  );

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

test('[a,c] intersection [b,d] | a < b < c < d = [b,c]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(3)
  );
  const j = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(4)
  );
  const expected = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(3)
  );

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

test('[a,b] intersection [c,d] | a < b < c < d = empty', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(3),
    Interval.incEnd(4)
  );
  const expected = Interval.empty;

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

// Exclusive

test('(a,d) intersection (b,c) | a < b < c < d = (b,c)', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(4)
  );
  const j = new Interval(
    Interval.excEnd(2),
    Interval.excEnd(3)
  );
  const expected = new Interval(
    Interval.excEnd(2),
    Interval.excEnd(3)
  );

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

test('(a,c) intersection (b,d) | a < b < c < d = (b,c)', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(3)
  );
  const j = new Interval(
    Interval.excEnd(2),
    Interval.excEnd(4)
  );
  const expected = new Interval(
    Interval.excEnd(2),
    Interval.excEnd(3)
  );

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

test('(a,b) intersection (c,d) | a < b < c < d = empty', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );
  const j = new Interval(
    Interval.excEnd(3),
    Interval.excEnd(4)
  );
  const expected = Interval.empty;

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

// Mixed

test('[a,b] intersection (a,b) | a < b = (a,b)', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );
  const expected = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

test('[a,b] intersection empty | a < b = empty', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = Interval.empty;
  const expected = Interval.empty;

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

/**
 * Unify
 */

// Inclusive

test('[a,d] unify [b,c] | a < b < c < d = [a,d]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(4)
  );
  const j = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(3)
  );
  const expected = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(4)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

test('[a,c] unify [b,d] | a < b < c < d = [a,d]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(3)
  );
  const j = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(4)
  );
  const expected = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(4)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

test('[a,b] unify empty | a < b = [a,b]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = Interval.empty;
  const expected = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

// Exclusive

test('(a,d) unify (b,c) | a < b < c < d = (a,d)', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(4)
  );
  const j = new Interval(
    Interval.excEnd(2),
    Interval.excEnd(3)
  );
  const expected = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(4)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

test('(a,c) unify (b,d) | a < b < c < d = (a,d)', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(3)
  );
  const j = new Interval(
    Interval.excEnd(2),
    Interval.excEnd(4)
  );
  const expected = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(4)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

test('(a,b) unify empty | a < b = (a,b)', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );
  const j = Interval.empty;
  const expected = new Interval(
    Interval.excEnd(1),
    Interval.excEnd(2)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

// Empty

test('empty unify empty = empty', t => {
  const i = Interval.empty;
  const j = Interval.empty;
  const expected = Interval.empty;

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

// Mixed

test('[a,b] unify (b,c] | a < b < c = [a,c]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.excEnd(2),
    Interval.incEnd(3)
  );
  const expected = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(3)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

test('[a,b) unify [b,c] | a < b < c = [a,c]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.excEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(2),
    Interval.incEnd(3)
  );
  const expected = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(3)
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

/**
 * Custom sort function
 */

test('[a,b] is equal to [a,b] with custom sort', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );
  const j = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );

  t.truthy(i.equalTo(j));
  t.truthy(j.equalTo(i));
});

test('[a,b] is not equal to empty with custom sort', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );
  const j = ChirpInterval.empty;

  t.falsy(i.equalTo(j));
  t.falsy(j.equalTo(i));
});

test('[a,b] intersection empty with custom sort = empty', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );
  const j = ChirpInterval.empty;
  const expected = ChirpInterval.empty;

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

test('(a,b) intersection empty with custom sort = empty', t => {
  const i = new ChirpInterval(
    ChirpInterval.excEnd(makeChirp(1)),
    ChirpInterval.excEnd(makeChirp(2))
  );
  const j = ChirpInterval.empty;
  const expected = ChirpInterval.empty;

  t.truthy(i.intersection(j).equalTo(expected));
  t.truthy(j.intersection(i).equalTo(expected));
});

test('[a,b] unify empty with custom sort = [a,b]', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );
  const j = ChirpInterval.empty;
  const expected = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

test('(a,b) unify empty with custom sort = (a,b)', t => {
  const i = new ChirpInterval(
    ChirpInterval.excEnd(makeChirp(1)),
    ChirpInterval.excEnd(makeChirp(2))
  );
  const j = ChirpInterval.empty;
  const expected = new ChirpInterval(
    ChirpInterval.excEnd(makeChirp(1)),
    ChirpInterval.excEnd(makeChirp(2))
  );

  t.truthy(i.unify(j).equalTo(expected));
  t.truthy(j.unify(i).equalTo(expected));
});

/**
 * Membership
 */

test('anything contains of empty is false', t => {
  t.falsy(Interval.empty.contains(1));
  t.falsy(Interval.empty.contains('cake'));
  t.falsy(Interval.empty.contains(undefined));
});

test('[0,2] contains 0, 1 & 2', t => {
  const i = new Interval(
    Interval.incEnd(0),
    Interval.incEnd(2)
  );
  t.truthy(i.contains(0));
  t.truthy(i.contains(1));
  t.truthy(i.contains(2));
});

test('(0,2] contains 1 & 2', t => {
  const i = new Interval(
    Interval.excEnd(0),
    Interval.incEnd(2)
  );
  t.falsy(i.contains(0));
  t.truthy(i.contains(1));
  t.truthy(i.contains(2));
});

test('[0,2) contains 0 & 1', t => {
  const i = new Interval(
    Interval.incEnd(0),
    Interval.excEnd(2)
  );
  t.truthy(i.contains(0));
  t.truthy(i.contains(1));
  t.falsy(i.contains(2));
});

test('(0,2) contains 1', t => {
  const i = new Interval(
    Interval.excEnd(0),
    Interval.excEnd(2)
  );
  t.falsy(i.contains(0));
  t.truthy(i.contains(1));
  t.falsy(i.contains(2));
});

/**
 * subsets
 */

test('empty is a subset of everything', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval( // empty
    Interval.incEnd(4),
    Interval.incEnd(-123)
  );
  t.truthy(Interval.empty.isSubsetOf(Interval.empty));
  t.truthy(Interval.empty.isSubsetOf(Interval.whole));
  t.truthy(Interval.empty.isSubsetOf(i));
  t.truthy(Interval.empty.isSubsetOf(j));
  t.truthy(j.isSubsetOf(Interval.empty));
});

test('[1,2] is subset of [0,4]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(0),
    Interval.incEnd(4)
  );
  t.truthy(i.isSubsetOf(j));
});

test('[1,2] is subset of (0,4)', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.excEnd(0),
    Interval.excEnd(4)
  );
  t.truthy(i.isSubsetOf(j));
});

test('[0,4] is not a subset of [1,2]', t => {
  const i = new Interval(
    Interval.incEnd(0),
    Interval.incEnd(4)
  );
  const j = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  t.falsy(i.isSubsetOf(j));
});

test('[1,2] is subset of [1,2]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  t.truthy(i.isSubsetOf(j));
  t.truthy(j.isSubsetOf(i));
});

test('(1,2] is subset of [1,2]', t => {
  const i = new Interval(
    Interval.excEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  t.truthy(i.isSubsetOf(j));
});

test('[1,2) is subset of [1,2]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.excEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  t.truthy(i.isSubsetOf(j));
});

test('[1,2] is not a subset of (1,2]', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.excEnd(1),
    Interval.incEnd(2)
  );
  t.falsy(i.isSubsetOf(j));
});

test('[1,2] is not a subset of [1,2)', t => {
  const i = new Interval(
    Interval.incEnd(1),
    Interval.incEnd(2)
  );
  const j = new Interval(
    Interval.incEnd(1),
    Interval.excEnd(2)
  );
  t.falsy(i.isSubsetOf(j));
});

/**
 * Unbounded
 */

test('whole produces unbounded interval', t => {
  const unbounded = new Interval(
    Interval.negInf,
    Interval.posInf
  );
  t.truthy(Interval.whole.equalTo(unbounded));
});

test('unbounded contains everything', t => {
  t.truthy(Interval.whole.contains(1));
  t.truthy(Interval.whole.contains('cake'));
  t.truthy(Interval.whole.contains(-1));
  t.truthy(Interval.whole.contains(undefined));
});

test('unbounded is equal to itself', t => {
  t.truthy(Interval.whole.equalTo(Interval.whole));
});

test('(-inf,1] contains 1', t => {
  const i = new ChirpInterval(
    ChirpInterval.negInf,
    ChirpInterval.incEnd(makeChirp(1))
  );
  t.truthy(i.contains(makeChirp(1)));
});

test('[1,inf) contains 1', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.posInf
  );
  t.truthy(i.contains(makeChirp(1)));
});

test('whole intersection * is *', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );
  t.truthy(ChirpInterval.whole.intersection(i).equalTo(i));
  t.truthy(i.intersection(ChirpInterval.whole).equalTo(i));
});

test('whole unify * is whole', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(2))
  );
  t.truthy(ChirpInterval.whole.unify(i).equalTo(ChirpInterval.whole));
  t.truthy(i.unify(ChirpInterval.whole).equalTo(ChirpInterval.whole));
});

test('(-inf,inf) intersection [a,b] is [a,b]', t => {
  const i = ChirpInterval.whole;
  const j = ChirpInterval.singleton(makeChirp(1));
  const expected = ChirpInterval.singleton(makeChirp(1));

  t.truthy(i.intersection(j).equalTo(expected));
});

test('(-inf,inf) unify [a,b] is (-inf,inf)', t => {
  const i = ChirpInterval.whole;
  const j = ChirpInterval.singleton(makeChirp(1));
  const expected = ChirpInterval.whole;

  t.truthy(i.unify(j).equalTo(expected));
});

test('(-inf,-inf) unify (inf,inf) is empty', t => {
  const i = new ChirpInterval(
    ChirpInterval.negInf,
    ChirpInterval.negInf
  );
  const j = new ChirpInterval(
    ChirpInterval.posInf,
    ChirpInterval.posInf
  );
  const expected = ChirpInterval.empty;

  t.truthy(i.unify(j).equalTo(expected));
});

test('(-inf,inf) unify (inf,inf) is empty', t => {
  const i = new ChirpInterval(
    ChirpInterval.negInf,
    ChirpInterval.negInf
  );
  const j = new ChirpInterval(
    ChirpInterval.posInf,
    ChirpInterval.posInf
  );
  const expected = ChirpInterval.empty;

  t.truthy(i.unify(j).equalTo(expected));
});

test('whole.complement is empty,empty', t => {
  const i = ChirpInterval.whole;
  const actual = i.complement();
  const expected = {
    before: ChirpInterval.empty,
    after: ChirpInterval.empty
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});

test('empty.complement is whole,whole', t => {
  const i = ChirpInterval.empty;
  const actual = i.complement();
  const expected = {
    before: ChirpInterval.whole,
    after: ChirpInterval.whole
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});

test('[a,b].complement is [-inf, a), (b,inf]', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(200))
  );
  const actual = i.complement();
  const expected = {
    before: new ChirpInterval(
      ChirpInterval.negInf,
      ChirpInterval.excEnd(makeChirp(1))
    ),
    after: new ChirpInterval(
      ChirpInterval.excEnd(makeChirp(200)),
      ChirpInterval.posInf
    )
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});

test('(a,b].complement is [-inf, a], (b,inf]', t => {
  const i = new ChirpInterval(
    ChirpInterval.excEnd(makeChirp(1)),
    ChirpInterval.incEnd(makeChirp(200))
  );
  const actual = i.complement();
  const expected = {
    before: new ChirpInterval(
      ChirpInterval.negInf,
      ChirpInterval.incEnd(makeChirp(1))
    ),
    after: new ChirpInterval(
      ChirpInterval.excEnd(makeChirp(200)),
      ChirpInterval.posInf
    )
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});

test('[a,b).complement is [-inf, a), [b,inf]', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.excEnd(makeChirp(200))
  );
  const actual = i.complement();
  const expected = {
    before: new ChirpInterval(
      ChirpInterval.negInf,
      ChirpInterval.excEnd(makeChirp(1))
    ),
    after: new ChirpInterval(
      ChirpInterval.incEnd(makeChirp(200)),
      ChirpInterval.posInf
    )
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});

test('(a,b).complement is [-inf, a], [b,inf]', t => {
  const i = new ChirpInterval(
    ChirpInterval.excEnd(makeChirp(1)),
    ChirpInterval.excEnd(makeChirp(200))
  );
  const actual = i.complement();
  const expected = {
    before: new ChirpInterval(
      ChirpInterval.negInf,
      ChirpInterval.incEnd(makeChirp(1))
    ),
    after: new ChirpInterval(
      ChirpInterval.incEnd(makeChirp(200)),
      ChirpInterval.posInf
    )
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});

test('[a,inf).complement is [-inf, a), empty', t => {
  const i = new ChirpInterval(
    ChirpInterval.incEnd(makeChirp(1)),
    ChirpInterval.posInf
  );
  const actual = i.complement();
  const expected = {
    before: new ChirpInterval(
      ChirpInterval.negInf,
      ChirpInterval.excEnd(makeChirp(1))
    ),
    after: ChirpInterval.empty
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});

test('(-inf,b].complement is empty, (b,inf]', t => {
  const i = new ChirpInterval(
    ChirpInterval.negInf,
    ChirpInterval.incEnd(makeChirp(200))
  );
  const actual = i.complement();
  const expected = {
    before: ChirpInterval.empty,
    after: new ChirpInterval(
      ChirpInterval.excEnd(makeChirp(200)),
      ChirpInterval.posInf
    )
  };
  t.truthy(actual.before.equalTo(expected.before), 'Before is as expected');
  t.truthy(actual.after.equalTo(expected.after), 'After is as expected');
});
