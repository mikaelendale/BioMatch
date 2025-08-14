import json
import random
from datetime import datetime, timedelta

# This script generates a comprehensive donor database for BioMatch
# Run this to populate the system with realistic test data

def generate_donor_database():
    """Generate a large database of mock donors with realistic HLA profiles"""
    
    # HLA alleles with population frequencies (simplified)
    hla_alleles = {
        'HLA-A': ['A*01:01', 'A*02:01', 'A*03:01', 'A*11:01', 'A*23:01', 'A*24:02', 'A*26:01', 'A*29:02', 'A*30:01', 'A*31:01', 'A*32:01', 'A*33:01', 'A*68:01', 'A*68:02', 'A*69:01', 'A*74:01'],
        'HLA-B': ['B*07:02', 'B*08:01', 'B*13:02', 'B*14:02', 'B*15:01', 'B*18:01', 'B*27:05', 'B*35:01', 'B*38:01', 'B*39:01', 'B*40:01', 'B*44:02', 'B*44:03', 'B*49:01', 'B*50:01', 'B*51:01', 'B*52:01', 'B*53:01', 'B*55:01', 'B*56:01', 'B*57:01', 'B*58:01'],
        'HLA-C': ['C*01:02', 'C*02:02', 'C*03:03', 'C*03:04', 'C*04:01', 'C*05:01', 'C*06:02', 'C*07:01', 'C*07:02', 'C*08:02', 'C*12:02', 'C*12:03', 'C*14:02', 'C*15:02', 'C*16:01', 'C*17:01', 'C*18:01'],
        'HLA-DRB1': ['DRB1*01:01', 'DRB1*03:01', 'DRB1*04:01', 'DRB1*04:04', 'DRB1*07:01', 'DRB1*08:01', 'DRB1*09:01', 'DRB1*10:01', 'DRB1*11:01', 'DRB1*12:01', 'DRB1*13:01', 'DRB1*13:02', 'DRB1*14:01', 'DRB1*15:01', 'DRB1*16:01'],
        'HLA-DQB1': ['DQB1*02:01', 'DQB1*02:02', 'DQB1*03:01', 'DQB1*03:02', 'DQB1*03:03', 'DQB1*04:02', 'DQB1*05:01', 'DQB1*05:02', 'DQB1*05:03', 'DQB1*06:01', 'DQB1*06:02', 'DQB1*06:03', 'DQB1*06:04', 'DQB1*06:09'],
        'HLA-DPB1': ['DPB1*01:01', 'DPB1*02:01', 'DPB1*03:01', 'DPB1*04:01', 'DPB1*04:02', 'DPB1*05:01', 'DPB1*06:01', 'DPB1*09:01', 'DPB1*10:01', 'DPB1*11:01', 'DPB1*13:01', 'DPB1*14:01', 'DPB1*17:01', 'DPB1*19:01']
    }
    
    blood_types = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']
    organ_types = ['kidney', 'liver', 'heart', 'lung', 'pancreas']
    locations = [
        'New York, NY', 'Los Angeles, CA', 'Chicago, IL', 'Houston, TX', 'Phoenix, AZ',
        'Philadelphia, PA', 'San Antonio, TX', 'San Diego, CA', 'Dallas, TX', 'San Jose, CA',
        'Austin, TX', 'Jacksonville, FL', 'Fort Worth, TX', 'Columbus, OH', 'Charlotte, NC',
        'San Francisco, CA', 'Indianapolis, IN', 'Seattle, WA', 'Denver, CO', 'Boston, MA'
    ]
    
    first_names = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Barbara', 'Richard', 'Susan', 'Joseph', 'Jessica', 'Thomas', 'Sarah', 'Christopher', 'Karen', 'Charles', 'Nancy', 'Daniel', 'Lisa', 'Matthew', 'Betty', 'Anthony', 'Helen', 'Mark', 'Sandra', 'Donald', 'Donna', 'Steven', 'Carol', 'Paul', 'Ruth', 'Andrew', 'Sharon', 'Joshua', 'Michelle']
    
    last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores']
    
    donors = []
    
    # Generate 1000 donors for comprehensive testing
    for i in range(1000):
        # Generate HLA profile
        hla_profile = {}
        for locus, alleles in hla_alleles.items():
            hla_profile[locus] = [random.choice(alleles), random.choice(alleles)]
        
        # Generate random registration date (last 4 years)
        start_date = datetime.now() - timedelta(days=4*365)
        random_days = random.randint(0, 4*365)
        reg_date = start_date + timedelta(days=random_days)
        
        donor = {
            'id': f'donor-{i+1:04d}',
            'name': f'{random.choice(first_names)} {random.choice(last_names)}',
            'age': random.randint(18, 67),
            'bloodType': random.choice(blood_types),
            'organType': random.choice(organ_types),
            'location': random.choice(locations),
            'hlaProfile': hla_profile,
            'registrationDate': reg_date.strftime('%Y-%m-%d'),
            'status': random.choices(['available', 'matched', 'unavailable'], weights=[85, 10, 5])[0]
        }
        
        donors.append(donor)
    
    # Save to JSON file
    with open('donor-database.json', 'w') as f:
        json.dump(donors, f, indent=2)
    
    print(f"Generated {len(donors)} donors")
    print(f"Available donors: {sum(1 for d in donors if d['status'] == 'available')}")
    print(f"Organ distribution:")
    for organ in organ_types:
        count = sum(1 for d in donors if d['organType'] == organ and d['status'] == 'available')
        print(f"  {organ}: {count}")
    
    return donors

if __name__ == "__main__":
    generate_donor_database()
