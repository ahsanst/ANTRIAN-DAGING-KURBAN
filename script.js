// Data awal sistem antrian
let queueData = {
    currentQueue: 'A001',
    currentOperator: '1',
    queueType: 'A',
    totalToday: 25,
    servingNow: 1,
    waitingCount: 24,
    operators: [
        { id: 1, name: 'OPERATOR 1', currentQueue: 'A001', isActive: true },
        { id: 2, name: 'OPERATOR 2', currentQueue: 'A005', isActive: true },
        { id: 3, name: 'OPERATOR 3', currentQueue: 'A008', isActive: true },
        { id: 4, name: 'OPERATOR 4', currentQueue: 'A012', isActive: false },
        { id: 5, name: 'OPERATOR 5', currentQueue: 'A015', isActive: true },
        { id: 6, name: 'OPERATOR 6', currentQueue: 'A018', isActive: true },
        { id: 7, name: 'OPERATOR 7', currentQueue: 'A022', isActive: false },
        { id: 8, name: 'OPERATOR 8', currentQueue: 'A025', isActive: true }
    ],
    history: [
        { time: '10:15:23', queue: 'A001', operator: 'OPERATOR 1' },
        { time: '10:12:05', queue: 'B003', operator: 'OPERATOR 5' },
        { time: '10:08:41', queue: 'A025', operator: 'OPERATOR 8' },
        { time: '10:05:17', queue: 'C002', operator: 'OPERATOR 3' },
        { time: '10:01:52', queue: 'A024', operator: 'OPERATOR 2' },
        { time: '09:58:36', queue: 'A023', operator: 'OPERATOR 6' },
        { time: '09:55:11', queue: 'B002', operator: 'OPERATOR 5' },
        { time: '09:51:47', queue: 'A022', operator: 'OPERATOR 7' }
    ]
};

// Inisialisasi halaman saat pertama kali dimuat
document.addEventListener('DOMContentLoaded', function() {
    initializeDateTime();
    initializeQueueDisplay();
    initializeControlPanel();
    initializeOperators();
    initializeHistory();
    setupEventListeners();
});

// Fungsi untuk mengupdate tanggal dan waktu secara real-time
function initializeDateTime() {
    function updateDateTime() {
        const now = new Date();
        
        // Format tanggal: Hari, DD MMMM YYYY
        const optionsDate = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateString = now.toLocaleDateString('id-ID', optionsDate).toUpperCase();
        document.getElementById('current-date').textContent = dateString;
        
        // Format waktu: HH:MM:SS
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        document.getElementById('current-time').textContent = `${hours}:${minutes}:${seconds}`;
    }
    
    // Update waktu setiap detik
    updateDateTime();
    setInterval(updateDateTime, 1000);
}

// Fungsi untuk menampilkan antrian saat ini
function initializeQueueDisplay() {
    document.getElementById('current-queue-number').textContent = queueData.currentQueue;
    document.getElementById('current-operator').textContent = `OPERATOR ${queueData.currentOperator}`;
    document.getElementById('total-today').textContent = queueData.totalToday;
    document.getElementById('serving-now').textContent = queueData.servingNow;
    document.getElementById('waiting-count').textContent = queueData.waitingCount;
}

// Fungsi untuk menginisialisasi panel kontrol
function initializeControlPanel() {
    document.getElementById('queue-number').value = queueData.currentQueue.substring(1);
    document.getElementById('operator-select').value = queueData.currentOperator;
    document.getElementById('queue-type').value = queueData.queueType;
}

// Fungsi untuk menampilkan operator
function initializeOperators() {
    const operatorsGrid = document.getElementById('operators-grid');
    operatorsGrid.innerHTML = '';
    
    queueData.operators.forEach(operator => {
        const operatorCard = document.createElement('div');
        operatorCard.className = `operator-card ${operator.isActive ? 'active' : ''}`;
        
        operatorCard.innerHTML = `
            <div class="operator-number">${operator.id}</div>
            <div class="operator-name">${operator.name}</div>
            <div class="current-queue">Sedang Melayani</div>
            <div class="queue-number">${operator.currentQueue}</div>
        `;
        
        operatorsGrid.appendChild(operatorCard);
    });
}

// Fungsi untuk menampilkan riwayat pemanggilan
function initializeHistory() {
    const historyList = document.getElementById('history-list');
    historyList.innerHTML = '';
    
    queueData.history.forEach(item => {
        const historyItem = document.createElement('div');
        historyItem.className = 'history-item';
        
        historyItem.innerHTML = `
            <div class="time">${item.time}</div>
            <div class="queue">${item.queue}</div>
            <div class="operator">${item.operator}</div>
        `;
        
        historyList.appendChild(historyItem);
    });
}

// Fungsi untuk menambahkan riwayat pemanggilan baru
function addToHistory(queue, operator) {
    const now = new Date();
    const timeString = now.toLocaleTimeString('id-ID', { hour12: false });
    
    // Tambahkan ke awal array
    queueData.history.unshift({
        time: timeString,
        queue: queue,
        operator: operator
    });
    
    // Hapus item terlama jika lebih dari 10
    if (queueData.history.length > 10) {
        queueData.history.pop();
    }
    
    // Perbarui tampilan
    initializeHistory();
}

// Fungsi untuk memanggil antrian dengan suara
function callQueue() {
    const queueNumber = document.getElementById('queue-number').value;
    const queueType = document.getElementById('queue-type').value;
    const operatorSelect = document.getElementById('operator-select');
    const operatorId = operatorSelect.value;
    const operatorName = operatorSelect.options[operatorSelect.selectedIndex].text;
    
    // Format nomor antrian dengan padding 3 digit
    const formattedQueueNumber = queueNumber.padStart(3, '0');
    const fullQueueNumber = `${queueType}${formattedQueueNumber}`;
    
    // Update antrian saat ini
    queueData.currentQueue = fullQueueNumber;
    queueData.currentOperator = operatorId;
    queueData.queueType = queueType;
    
    // Update data operator yang aktif
    const activeOperator = queueData.operators.find(op => op.id == operatorId);
    if (activeOperator) {
        activeOperator.currentQueue = fullQueueNumber;
        activeOperator.isActive = true;
    }
    
    // Update statistik
    queueData.servingNow++;
    queueData.waitingCount--;
    if (queueData.waitingCount < 0) queueData.waitingCount = 0;
    
    // Perbarui tampilan
    initializeQueueDisplay();
    initializeOperators();
    
    // Tambahkan ke riwayat
    addToHistory(fullQueueNumber, operatorName);
    
    // Mainkan suara panggilan pengumuman di bandara
    const announcementSound = document.getElementById('announcement-sound');
    announcementSound.play();
    
    // Setelah suara pengumuman selesai, mainkan suara panggilan antrian
    announcementSound.onended = function() {
        // Buat kalimat panggilan dalam bahasa Indonesia
        const callText = `Nomor antrian ${fullQueueNumber.split('').join(' ')}, silahkan menuju ke ${operatorName}`;
        
        // Gunakan Web Speech API untuk mengucapkan panggilan
        if ('speechSynthesis' in window) {
            // Hentikan semua ucapan yang sedang berlangsung
            speechSynthesis.cancel();
            
            // Buat objek ucapan
            const utterance = new SpeechSynthesisUtterance(callText);
            
            // Setel bahasa Indonesia
            utterance.lang = 'id-ID';
            
            // Atur kecepatan dan nada suara
            utterance.rate = 0.9;
            utterance.pitch = 1.2;
            
            // Pilih suara wanita jika tersedia
            const voices = speechSynthesis.getVoices();
            const femaleVoice = voices.find(voice => 
                voice.lang.includes('id') && voice.name.toLowerCase().includes('female')
            ) || voices.find(voice => voice.lang.includes('id'));
            
            if (femaleVoice) {
                utterance.voice = femaleVoice;
            }
            
            // Ucapkan panggilan
            speechSynthesis.speak(utterance);
        } else {
            // Fallback jika Web Speech API tidak didukung
            alert(`Panggilan: ${callText}`);
        }
        
        // Mainkan suara beep
        const beepSound = document.getElementById('beep-sound');
        beepSound.play();
    };
}

// Fungsi untuk memanggil antrian berikutnya secara otomatis
function callNextQueue() {
    // Ambil nomor antrian saat ini (tanpa huruf awalan)
    const currentQueueNum = parseInt(queueData.currentQueue.substring(1));
    
    // Generate nomor antrian berikutnya
    const nextQueueNum = currentQueueNum + 1;
    const nextQueueStr = nextQueueNum.toString().padStart(3, '0');
    
    // Update input dengan nomor berikutnya
    document.getElementById('queue-number').value = nextQueueStr;
    
    // Secara otomatis pindah ke operator berikutnya (berputar dari 1-8)
    const currentOperator = parseInt(document.getElementById('operator-select').value);
    const nextOperator = currentOperator === 8 ? 1 : currentOperator + 1;
    document.getElementById('operator-select').value = nextOperator;
    
    // Panggil antrian baru
    callQueue();
}

// Fungsi untuk setup event listener
function setupEventListeners() {
    // Tombol panggil antrian
    document.getElementById('call-btn').addEventListener('click', callQueue);
    
    // Tombol antrian berikutnya
    document.getElementById('next-btn').addEventListener('click', callNextQueue);
    
    // Input nomor antrian hanya menerima angka
    document.getElementById('queue-number').addEventListener('input', function(e) {
        this.value = this.value.replace(/[^0-9]/g, '');
        
        // Batasi maksimal 3 digit
        if (this.value.length > 3) {
            this.value = this.value.substring(0, 3);
        }
    });
    
    // Validasi input saat form disubmit (enter)
    document.getElementById('queue-number').addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            callQueue();
        }
    });
    
    // Update antrian saat operator berubah
    document.getElementById('operator-select').addEventListener('change', function() {
        // Bisa menambahkan logika tambahan di sini jika diperlukan
        console.log(`Operator berubah ke: ${this.value}`);
    });
    
    // Update antrian saat jenis antrian berubah
    document.getElementById('queue-type').addEventListener('change', function() {
        // Reset nomor antrian untuk jenis antrian baru
        document.getElementById('queue-number').value = '001';
    });
}

// Inisialisasi Web Speech API voices saat tersedia
if ('speechSynthesis' in window) {
    // Beberapa browser memerlukan ini untuk memuat voices
    speechSynthesis.onvoiceschanged = function() {
        console.log('Voices loaded:', speechSynthesis.getVoices().length);
    };
}