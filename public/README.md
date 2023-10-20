Test Gen
========
------------------------------------------------
Contact : <gurvinder@dhillon.guru>

Test Gen generates test cases that are more effective than manually generated tests and in a fraction of the time required by hands-on test case design.

Test Gen isndesigned for generating combinations of inputs for software testing. It is a powerful tool that helps reduce the number of tests needed while still ensuring comprehensive coverage by generating optimized combinations of inputs.

For instance, to create a test suite for disk partition creation, the domain can be described by the following parameters: ```Partition Type```, ```Partition Size```, ```File System```, ```Format Method```, ```Cluster Size```, and ```Compression```. Each parameter consists of a finite number of possible values. For example, ```Compression``` can only be ```On``` or ```Off```, other parameters are made finite with help of equivalence partitioning:

      | Type   | Size  | Format method | File system | Cluster size | Compression |
      |--------|-------|---------------|-------------|--------------|-------------|
      | Single | 10    | Quick         | FAT         | 512          | On          |
      | Span   | 100   | Slow          | FAT32       | 1024         | Off         |
      | Stripe | 500   |               | NTFS        | 2048         |             |
      | Mirror | 1000  |               |             | 4096         |             |
      | RAID-5 | 5000  |               |             | 8192         |             |
      |        | 10000 |               |             | 16384        |             |
      |        | 40000 |               |             | 32768        |             |
      |        |       |               |             | 65536        |             |

For such a model, thousands of possible test cases can be generated. It would be difficult to test all of them in a reasonable amount of time. Instead of attempting to cover all possible combinations, we settle on testing all possible pairs of values. For example, ```{Type:Single, File system:FAT}``` is one such value pair, ```{Size:10, Format method:Slow}``` is another. Consequently, one test case can cover many pairs. Research shows that testing all pairs is an effective alternative to exhaustive testing and is much less costly.

# Usage

## Model
Test Gen accepts tabular or json model as an input and produces a set of test cases.
To add parameters click the "Add Parameter" button and specify the parameter name as column name in the table.
To add paramter values, click the "Add Value" button and specify the parameter value in the table cell.


By default, Test Gen generates a pair-wise test suite (all pairs covered), but the order can be set by ```Order``` to a value larger than two. For example, when ```Order:3``` is specified, the test suite will cover all triplets of values. It will produce a larger number of tests but will potentially make the test suite even more effective. The maximum order for a model is equal to the number of parameters, which will result in an exhaustive test suite. Following the same principle, specifying ```Order:1``` will produce a test suite that merely covers all values (combinations of 1).

## Output Format
The test cases are generated in the form of a Table and Json.

# Constraints

Constraints express inherent limitations of the modelled domain. In the example above, one of the pairs that will appear in at least one test case is ```{File system:FAT, Size:5000}```. In practice, the FAT file system cannot be applied on volumes larger than 4,096 MB. Note that you cannot simply remove those violating test cases from the result because an offending test case may cover other, possibly valid, pairs that would not otherwise be tested. Instead of losing valid pairs, it is better to eliminate disallowed combinations during the generation process. In Test Gen, this can be done by specifying constraints, for example:

    IF [File system] = "FAT"   THEN [Size] <= 4096;
    IF [File system] = "FAT32" THEN [Size] <= 32000;

## Conditional Constraints

A term ```[parameter] relation value``` is an atomic part of a constraint expression. The following relations can be used: ```=```, ```<>```, ```>```, ```>=```, ```<```, ```<=```, and ```LIKE```. ```LIKE``` is a wildcard-matching string operator (```*``` - any character, ```?``` – one character).

    [Size] < 10000
    [Compression] = "OFF"
    [File system] LIKE "FAT*"

Operator IN allows specifying a set of values:

    IF [Cluster size] IN {512, 1024, 2048} THEN [Compression] = "Off";
    IF [File system] IN {"FAT", "FAT32"}   THEN [Compression] = "Off";

The ```IF```, ```THEN```, and ```ELSE``` parts of an expression may contain multiple terms joined by logical operators: ```NOT```, ```AND```, and ```OR```. Parentheses are allowed in order to change the default operator priority:

    IF [File system] <> "NTFS" OR
     ( [File system] =  "NTFS" AND [Cluster size] > 4096 )
    THEN [Compression] = "Off";

    IF NOT ( [File system] = "NTFS" OR
           ( [File system] = "NTFS" AND NOT [Cluster size] <= 4096 ))
    THEN [Compression] = "Off";

Parameters can be compared to other parameters, like in this example:

    #
    # Machine 1
    #
    OS_1:   Win7, Win8, Win10
    SKU_1:  Home, Pro
    LANG_1: English, Spanish, Chinese

    #
    # Machine 2
    #
    OS_2:   Win7, Win8, Win10
    SKU_2:  Home, Pro
    LANG_2: English, Spanish, Chinese, Hindi

    IF [LANG_1] = [LANG_2]
    THEN [OS_1] <> [OS_2] AND [SKU_1] <> [SKU_2];

## Unconditional Constraints (Invariants)

An invariant declares an always valid limitation of a domain:

    #
    # At least one parameter must be different to be a meaningful test case
    #

    [OS_1] <> [OS_2] OR [SKU_1] <> [SKU_2] OR [LANG_1] <> [LANG_2];

    #
    # All parameters must be different (we use AND operator)
    #

    [OS_1] <> [OS_2] AND [SKU_1] <> [SKU_2] AND [LANG_1] <> [LANG_2];

## Types

PICT has a simple type system. There are two types of parameters: a string and a numeric type. Types do not have to be explicitly declared. A parameter is considered numeric when all of its values can be converted to a number (an integer or a float).

 Types are only important when evaluating constraints. A numeric parameter is only comparable to a number, and a string parameter is only comparable to another string. For example:

    Size:  1, 2, 3, 4, 5
    Value: a, b, c, d

    IF [Size] > 3 THEN [Value] > "b";

If a value has multiple names, only the first is considered when PICT detects the type.

## Case Sensitiveness

By default, Test Gen does all its comparisons and checks case-insensitively. For instance, if there are two parameters defined: ```OS``` and ```os```, a duplication of names will be detected (parameter names must be unique). Constraints are also resolved case-insensitively by default:

    IF [OS] = "Win10" THEN ...

will match both ```Win10``` and ```win10``` values (values of a parameter are not required to be unique).

# Advanced Modelling Features

## Negative Testing

There is a special function negative that can be used to create a value for negative testing.
To use this simply wrap your paramter value inside negative. Example ```negative("Win10") or negative(8) or negative("null")```.

In addition to testing valid combinations, referred to as “positive testing,” it is often desirable to test using values outside the allowable range to make sure the program handles errors properly. This “negative testing” should be conducted such that only one out-of-range value is present in any test case. This is because of the way in which typical applications are written: namely, they often error out when the first error is detected.

"Input masking" is a type of problem in test design, in which one out-of-range input prevents another invalid input from being tested.

Consider the following routine, which takes two arguments:

    float SumSquareRoots( float a, float b )
    {
          if ( a < 0 ) throw error;           // [1]
          if ( b < 0 ) throw error;           // [2]

          return ( sqrt( a ) + sqrt( b ));
    };


Although the routine can be called with any numbers for ```a``` or ```b```, it only makes sense to do the calculation on non-negative numbers. For that reason by the way, the routine does verifications [1] and [2] on the arguments. Now, assume a test ```( a: -1, b: -1 )``` was used to test that negative case. Here, ```a: -1``` "masks" ```b: -1``` because the check [2] never gets executed. If it did not exist at all, that problem in code would go unnoticed.

To prevent input masking issues, it is important that two out-of-range values do not appear in the same test case.

Warpping a value inside ```negative``` marks it invalid or out-of-allowable-range.

    #
    # SumSquareRoots model
    #

    A: negative(-1), 0, 1, 2
    B: negative(-1), 0, 1, 2

PICT guarantees that all possible pairs of valid (or in-range) values will be covered and all possible combinations of any out-of-range / invalid value will be paired only with all valid values.

    A       B
    2       0
    2       2
    0       0
    0       1
    1       0
    2       1
    0       2
    1       2
    1       1
    -1     2
    1       -1
    0       -1
    -1     1
    2       -1
    -1     0

Notes:
 1. The ```negative``` is not a part of a value when it comes to type detection or constraint evaluation. A valid constraint for the above example would look like this: ```if [A] = -1 then [B] = 0;
 2. If a value has multiple names, only prefixing the first name will make the value out-of-range.

## Excluding Entire Parameters - The "Dummy Value Technique"

Some test suites may require that under certain conditions entire parameters should be ignored. Negative testing (as described above) could be such a scenario. There, an error or a failure may stop the application under test and make any other parameter choices meaningless. By design, PICT will try to pack as many combinations into the fewest test cases possible, including those that contain values that will trigger failures.  In these cases, we will see testable pairs essentially wasted.  In some scenarios the ```negative``` function can be used to prevent this, but for scenarios where it doesn't apply, we can use the "dummy value technique" instead.

Test Gen does not have any special handling for the dummy value technique.  To use it, you need to manually modify your model as described below.

Consider the following example where a ```P1: -1``` is a value that triggers an application error.

    P1: -1, 0, 1
    P2:  A, B, C
    P3:  X, Y, Z

We want to test this condition independently and not associate any values of ```P2``` or ```P3``` with it. To accomplish that, we add a dummy value ```NA``` to parameters ```P2``` and ```P3```. That dummy value will indicate that the parameter should be ignored. We can then use constraints to make sure tests are generated correctly:

    P1: -1, 0, 1
    P2:  A, B, C, NA
    P3:  X, Y, Z, NA

    IF [P1] = -1
      THEN [P2] =  "NA" AND [P3] =  "NA"
      ELSE [P2] <> "NA" AND [P3] <> "NA";

This will result in a single test for ```P1: -1``` with ```NA``` set for ```P2``` and ```P3```. No other combinations values of ```P2``` and ```P3``` are used up for the test containing ```P1: -1```:

    P1      P2      P3
    0       C       Z
    1       B       Z
    1       C       Y
    0       A       X
    1       C       X
    0       B       X
    0       A       Y
    -1      NA      NA
    0       B       Y
    1       A       Z

The downside of this method is that constraints will get progressively more complex. For example, when additional failure inducing values are added to the model e.g. ```P2: Null```:

    P1: -1, 0, 1
    P2: A, B, C, Null, NA
    P3: X, Y, Z, NA

    IF [P1] = -1
      THEN [P2] = "NA" AND [P3] = "NA"
      ELSE [P2] <> "NA" AND
         ( [P3] <> "NA" OR [P2] = "Null" );

    IF [P2] = "Null" OR [P2] = "NA"
      THEN [P3] = "NA";

Two additional tests will be added (not all output shown):

    P1      P2      P3
    0       Null    NA
    1       Null    NA

A more concrete example:

    OS: Windows, Ubuntu
    CPU: Intel, AMD
    DBMS: PostgreSQL, MySQL
    JavaVersion: 18, 19, 20
    DotNetVersion: 4.8, 4.8.1

The above model will generate these tests:

    OS          CPU     DBMS        JavaVersion     DotNetVersion
    Windows     AMD     PostgreSQL  18              4.8
    Windows     Intel   MySQL       20              4.8.1
    Ubuntu      Intel   PostgreSQL  19              4.8.1
    Ubuntu      AMD     MySQL       20              4.8
    Windows     AMD     MySQL       19              4.8
    Ubuntu      AMD     MySQL       18              4.8.1
    Windows     Intel   MySQL       18              4.8
    Ubuntu      Intel   PostgreSQL  20              4.8

The problem is that there is no .NET on Ubuntu, so the DotNetVersion parameter doesn't make any sense for those tests.  If we add "NA" and a constraint to the model, like this:

    OS: Windows, Ubuntu
    CPU: Intel, AMD
    DBMS: PostgreSQL, MySQL
    JavaVersion: 18, 19, 20
    DotNetVersion: 4.8, 4.8.1, NA

    IF [OS] = "Ubuntu"
      THEN [DotNetVersion] = "NA"
      ELSE [DotNetVersion] <> "NA";

... then the generated tests will be these:

    OS          CPU     DBMS        JavaVersion     DotNetVersion
    Windows     AMD     PostgreSQL  20              4.8
    Ubuntu      Intel   MySQL       18              NA
    Windows     Intel   PostgreSQL  18              4.8
    Windows     AMD     MySQL       18              4.8.1
    Windows     AMD     MySQL       19              4.8
    Ubuntu      AMD     PostgreSQL  19              NA
    Windows     Intel   PostgreSQL  19              4.8.1
    Windows     Intel   MySQL       20              4.8.1
    Ubuntu      AMD     PostgreSQL  20              NA


# Constraints Grammar

    Constraints   :: =
      Constraint
    | Constraint Constraints

    Constraint    :: =
      IF Predicate THEN Predicate ELSE Predicate;
    | Predicate;

    Predicate     :: =
      Clause
    | Clause LogicalOperator Predicate

    Clause        :: =
      Term
    | ( Predicate )
    | NOT Predicate

    Term          :: =
      ParameterName Relation Value
    | ParameterName LIKE PatternString
    | ParameterName IN { ValueSet }
    | ParameterName Relation ParameterName

    ValueSet       :: =
      Value
    | Value, ValueSet

    LogicalOperator ::=
      AND
    | OR

    Relation      :: =
      =
    | <>
    | >
    | >=
    | <
    | <=

    ParameterName ::= [String]

    Value         :: =
      "String"
    | Number

    String        :: = whatever is typically regarded as a string of characters

    Number        :: = whatever is typically regarded as a number

    PatternString ::= string with embedded special characters (wildcards):
                      * a series of characters of any length (can be zero)
                      ? any one character