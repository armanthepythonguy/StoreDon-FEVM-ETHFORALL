#!/usr/bin/perl

use warnings;
use strict;
use 5.014;

my $acceptlist = { map {( $_ => 1 )} qw(
  t3vxr6utzqjobnjnhi5gwn7pqoqstw7nrh4kchft6tzb2e7xorwvj5f3tg3du3kedadtkxvyp4jakf3zdd4iaa
)};

use JSON::PP 'decode_json';

my $deal = eval { decode_json(do{ local $/; <> }) };
if( ! defined $deal ) {
  print "Deal proposal JSON parsing failed: $@";
  exit 1;
}

if( $acceptlist->{$deal->{Proposal}{Client}} ) {
  print "Deals from client wallet $deal->{Proposal}{Client} will be accepted";
  exit 0;
}

print "This deal will not be accepted";

exit 1;